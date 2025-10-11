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

    // Récupérer les bons actifs de l'utilisateur
    const vouchers = await prisma.voucher.findMany({
      where: {
        userId: user.id,
        isUsed: false, // Bons non utilisés seulement
      },
      include: {
        merchant: {
          select: {
            name: true,
            merchantCode: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formater la réponse
    const formattedVouchers = vouchers.map((voucher) => ({
      id: voucher.id,
      merchantName: voucher.merchant.name,
      merchantCode: voucher.merchant.merchantCode,
      amount: voucher.amount,
      qrCode: voucher.qrCode,
      createdAt: voucher.createdAt.toISOString(),
    }));

    return NextResponse.json({ vouchers: formattedVouchers });
  } catch (error) {
    console.error("Error fetching user vouchers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}