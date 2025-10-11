const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('Usage: node scripts/reset-admin-password.js <email> <new-password>');
    process.exit(1);
  }

  try {
    // Hash le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Met à jour l'utilisateur
    const user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'admin' // S'assure que le rôle est admin
      },
    });

    console.log(`✅ Mot de passe réinitialisé avec succès pour ${user.email}`);
    console.log(`   Nom: ${user.name}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Nouveau mot de passe: ${newPassword}`);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error.message);

    if (error.code === 'P2025') {
      console.error(`   L'utilisateur avec l'email "${email}" n'existe pas.`);
      console.log('\n💡 Voulez-vous créer un nouvel admin ? Utilisez: npm run create-admin');
    }
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
