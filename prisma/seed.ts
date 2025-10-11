import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Créer un compte admin par défaut
  const adminEmail = "admin@neith.nc";
  const adminPassword = "admin123"; // À changer en production

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Administrateur Neith",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ Compte admin créé:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Mot de passe: ${adminPassword}`);
    console.log("⚠️  Changez le mot de passe en production!");
  } else {
    console.log("ℹ️  Compte admin existe déjà");
  }

  // Créer quelques marchands de test
  const testMerchants = [
    {
      name: "Lulu's Café",
      address: "Centre ville, Nouméa",
      creditPercentage: 10.0,
      threshold: 2000.0,
      validityMonths: 6,
      merchantCode: "LULU",
    },
    {
      name: "Super Marché NC",
      address: "Zone industrielle, Nouméa",
      creditPercentage: 5.0,
      threshold: 5000.0,
      validityMonths: 3,
      merchantCode: "SMNC",
    },
  ];

  for (const merchant of testMerchants) {
    const existing = await prisma.merchant.findUnique({
      where: { merchantCode: merchant.merchantCode },
    });

    if (!existing) {
      await prisma.merchant.create({
        data: {
          ...merchant,
          qrCode: `fidelisation://merchant/test-${merchant.merchantCode}`,
        },
      });
      console.log(`✅ Marchand créé: ${merchant.name} (${merchant.merchantCode})`);
    }
  }

  console.log("🎉 Seed terminé!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });