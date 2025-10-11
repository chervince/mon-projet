import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const createMerchantSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
  address: z.string().optional(),
  creditPercentage: z.number().min(1).max(20).default(10.0),
  threshold: z.number().min(500).default(2000.0),
  validityMonths: z.number().min(3).default(6),
  merchantCode: z.string().length(4).regex(/^[A-Z0-9]{4}$/),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createMerchantSchema.parse(body);

    // Vérifier unicité merchantCode
    const existing = await prisma.merchant.findUnique({
      where: { merchantCode: data.merchantCode },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Code marchand déjà utilisé" },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.create({
      data: {
        ...data,
        qrCode: `fidelisation://merchant/${crypto.randomUUID()}`,
      },
    });

    return NextResponse.json({
      merchant: {
        id: merchant.id,
        name: merchant.name,
        logo: merchant.logo,
        address: merchant.address,
        creditPercentage: merchant.creditPercentage,
        threshold: merchant.threshold,
        validityMonths: merchant.validityMonths,
        merchantCode: merchant.merchantCode,
        qrCode: merchant.qrCode,
        createdAt: merchant.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating merchant:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
        creditPercentage: true,
        threshold: true,
        validityMonths: true,
        merchantCode: true,
        qrCode: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ merchants });
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
