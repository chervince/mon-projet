import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ⚠️ ROUTE TEMPORAIRE - À SUPPRIMER APRÈS UTILISATION
// Cette route permet de réinitialiser le mot de passe admin en production

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword, secretKey } = body;

    // Clé secrète pour sécuriser cette route temporaire
    // Définissez ADMIN_RESET_SECRET dans vos variables d'environnement Vercel
    const ADMIN_RESET_SECRET = process.env.ADMIN_RESET_SECRET;

    if (!ADMIN_RESET_SECRET) {
      return NextResponse.json(
        { error: "Service non configuré" },
        { status: 503 }
      );
    }

    if (secretKey !== ADMIN_RESET_SECRET) {
      return NextResponse.json(
        { error: "Clé secrète invalide" },
        { status: 403 }
      );
    }

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Hash le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Met à jour l'utilisateur
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "admin", // S'assure que le rôle est admin
      },
    });

    return NextResponse.json({
      success: true,
      message: `Mot de passe réinitialisé pour ${user.email}`,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erreur réinitialisation:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
