import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const createEstablishmentSchema = z.object({
  name: z.string().min(1),
  pointsPerEuro: z.number().positive().default(1.0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, pointsPerEuro } = createEstablishmentSchema.parse(body);

    const establishment = await prisma.establishment.create({
      data: {
        name,
        pointsPerEuro,
        qrCode: `fidelisation://establishment/${crypto.randomUUID()}`,
      },
    });

    return NextResponse.json({
      establishment: {
        id: establishment.id,
        name: establishment.name,
        qrCode: establishment.qrCode,
        pointsPerEuro: establishment.pointsPerEuro,
      },
    });
  } catch (error) {
    console.error("Error creating establishment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const establishments = await prisma.establishment.findMany({
      select: {
        id: true,
        name: true,
        qrCode: true,
        pointsPerEuro: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ establishments });
  } catch (error) {
    console.error("Error fetching establishments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}