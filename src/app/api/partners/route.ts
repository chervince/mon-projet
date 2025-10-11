import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    // Récupérer tous les marchands
    const merchants = await prisma.merchant.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
        creditPercentage: true,
        threshold: true,
      },
    });

    // Enrichir avec les crédits de l'utilisateur
    const partners = await Promise.all(
      merchants.map(async (merchant) => {
        const userCredits = await prisma.credit.aggregate({
          where: {
            userId: user.id,
            merchantId: merchant.id,
            expiresAt: {
              gt: new Date(),
            },
          },
          _sum: {
            amount: true,
          },
        });

        return {
          id: merchant.id,
          name: merchant.name,
          logo: merchant.logo,
          address: merchant.address,
          creditPercentage: merchant.creditPercentage,
          threshold: merchant.threshold,
          userCredits: userCredits._sum.amount || 0,
        };
      })
    );

    // Trier par crédits décroissants
    partners.sort((a, b) => b.userCredits - a.userCredits);

    return NextResponse.json({ partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}