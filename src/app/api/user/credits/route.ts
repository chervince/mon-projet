import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Récupérer les crédits groupés par marchand
    const credits = await prisma.credit.groupBy({
      by: ["merchantId"],
      where: {
        userId: user.id,
        expiresAt: {
          gt: new Date(), // Crédits non expirés seulement
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Enrichir avec les infos marchands
    const enrichedCredits = await Promise.all(
      credits.map(async credit => {
        const merchant = await prisma.merchant.findUnique({
          where: { id: credit.merchantId },
          select: {
            name: true,
            logo: true,
          },
        });

        return {
          merchantId: credit.merchantId,
          merchantName: merchant?.name || "Marchand inconnu",
          merchantLogo: merchant?.logo,
          totalCredits: credit._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({ credits: enrichedCredits });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
