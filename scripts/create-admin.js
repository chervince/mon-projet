const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const name = process.argv[2];
  const email = process.argv[3];
  const password = process.argv[4];

  if (!name || !email || !password) {
    console.error('Usage: node scripts/create-admin.js <name> <email> <password>');
    console.error('Example: node scripts/create-admin.js "Admin" "admin@example.com" "MonMotDePasse123"');
    process.exit(1);
  }

  try {
    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée l'utilisateur admin
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✅ Administrateur créé avec succès !');
    console.log(`   Nom: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Mot de passe: ${password}`);
    console.log('\n🔐 Vous pouvez maintenant vous connecter avec ces identifiants.');
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);

    if (error.code === 'P2002') {
      console.error(`   Un utilisateur avec l'email "${email}" existe déjà.`);
      console.log('\n💡 Utilisez plutôt: node scripts/reset-admin-password.js <email> <new-password>');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
