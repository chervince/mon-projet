import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { ImageAnnotatorClient } from "@google-cloud/vision";

const prisma = new PrismaClient();

// Initialiser le client Google Cloud Vision
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Récupérer l'image du formulaire
    const formData = await request.formData();
    const file = formData.get('ticket') as File;

    if (!file) {
      return NextResponse.json({ error: "Aucune image reçue" }, { status: 400 });
    }

    // Convertir l'image en buffer
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Envoyer à Google Cloud Vision
    const [result] = await visionClient.textDetection({
      image: { content: imageBuffer },
    });

    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return NextResponse.json({
        error: "Aucun texte détecté sur l'image. Assurez-vous que le ticket est bien lisible."
      }, { status: 400 });
    }

    const fullText = detections[0].description || "";
    console.log("Texte OCR détecté:", fullText);

    // Extraire le montant (regex pour formats XPF courants)
    const amountMatch = fullText.match(/(?:total|montant|à\s+payer|net\s+à\s+payer)[\s:]*(\d{1,3}(?:\s?\d{3})*(?:[,.]\d{2})?)\s*(?:f|francs?|xpf)/i) ||
                       fullText.match(/(\d{1,3}(?:\s?\d{3})*(?:[,.]\d{2})?)\s*(?:f|francs?|xpf)(?:\s|$)/i) ||
                       fullText.match(/(\d{1,3}(?:\s?\d{3})*(?:[,.]\d{2})?)\s*xpf/i);

    if (!amountMatch) {
      return NextResponse.json({
        error: "Montant non trouvé. Vérifiez que le ticket montre clairement le montant total."
      }, { status: 400 });
    }

    // Nettoyer et convertir le montant
    const amountStr = amountMatch[1].replace(/\s/g, '').replace(',', '.');
    const ticketAmount = parseFloat(amountStr);

    if (isNaN(ticketAmount) || ticketAmount <= 0) {
      return NextResponse.json({ error: "Montant invalide détecté" }, { status: 400 });
    }

    // Identifier le marchand (par mots-clés configurés)
    const merchants = await prisma.merchant.findMany({
      select: {
        id: true,
        name: true,
        merchantCode: true,
        creditPercentage: true,
        threshold: true,
        validityMonths: true,
      },
    });

    let identifiedMerchant = null;
    let bestMatchScore = 0;

    for (const merchant of merchants) {
      // Mots-clés simples basés sur le nom du marchand
      const keywords = merchant.name.toLowerCase().split(/\s+/);
      const textLower = fullText.toLowerCase();

      let score = 0;
      for (const keyword of keywords) {
        if (keyword.length > 2 && textLower.includes(keyword)) {
          score += keyword.length; // Plus long = meilleur score
        }
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        identifiedMerchant = merchant;
      }
    }

    if (!identifiedMerchant || bestMatchScore < 3) {
      return NextResponse.json({
        error: "Marchand non reconnu. Ce ticket ne semble pas provenir d'un de nos partenaires."
      }, { status: 400 });
    }

    // Calculer les crédits à attribuer
    const creditsEarned = Math.round((ticketAmount * identifiedMerchant.creditPercentage) / 100);

    if (creditsEarned <= 0) {
      return NextResponse.json({
        error: "Le montant du ticket est trop faible pour gagner des crédits."
      }, { status: 400 });
    }

    // Vérifier anti-fraude basique (scans récents)
    const recentScans = await prisma.scanLog.count({
      where: {
        userId: user.id,
        merchantId: identifiedMerchant.id,
        timestamp: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes
        },
      },
    });

    if (recentScans >= 2) {
      return NextResponse.json({
        error: "Trop de scans récents. Veuillez attendre quelques minutes avant de scanner un nouveau ticket."
      }, { status: 429 });
    }

    // Calculer la date d'expiration des crédits
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + identifiedMerchant.validityMonths);

    // Créer l'enregistrement de scan
    const scanLog = await prisma.scanLog.create({
      data: {
        userId: user.id,
        merchantId: identifiedMerchant.id,
        ticketAmount,
        creditsEarned,
        ip: request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
      },
    });

    // Créer les crédits
    await prisma.credit.create({
      data: {
        userId: user.id,
        merchantId: identifiedMerchant.id,
        amount: creditsEarned,
        expiresAt,
      },
    });

    // Mettre à jour le total de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        pointsTotal: {
          increment: creditsEarned,
        },
      },
    });

    // Vérifier si seuil atteint pour génération bon
    const totalCredits = await prisma.credit.aggregate({
      where: {
        userId: user.id,
        merchantId: identifiedMerchant.id,
        expiresAt: {
          gt: new Date(),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const currentCredits = totalCredits._sum.amount || 0;
    let voucherGenerated = null;

    if (currentCredits >= identifiedMerchant.threshold) {
      // Générer un bon d'achat
      const voucherAmount = identifiedMerchant.threshold;

      voucherGenerated = await prisma.voucher.create({
        data: {
          userId: user.id,
          merchantId: identifiedMerchant.id,
          amount: voucherAmount,
          qrCode: `fidelisation://voucher/${crypto.randomUUID()}`,
          merchantCode: identifiedMerchant.merchantCode,
        },
      });

      // Reset les crédits à 0
      await prisma.credit.deleteMany({
        where: {
          userId: user.id,
          merchantId: identifiedMerchant.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      merchant: {
        name: identifiedMerchant.name,
        creditPercentage: identifiedMerchant.creditPercentage,
      },
      ticketAmount,
      creditsEarned,
      totalCredits: voucherGenerated ? 0 : currentCredits,
      voucherGenerated: voucherGenerated ? {
        id: voucherGenerated.id,
        amount: voucherGenerated.amount,
        merchantCode: voucherGenerated.merchantCode,
      } : null,
      scanId: scanLog.id,
    });

  } catch (error) {
    console.error("Error processing ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du ticket. Veuillez réessayer." },
      { status: 500 }
    );
  }
}