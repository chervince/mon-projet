import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const merchant = await prisma.merchant.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        logo: true,
        address: true,
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: "Marchand non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ merchant });
  } catch (error) {
    console.error("Error fetching merchant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
