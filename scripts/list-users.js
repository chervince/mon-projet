const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé dans la base de données.');
      console.log('\n💡 Créez un admin avec: node scripts/create-admin.js <name> <email> <password>');
      return;
    }

    console.log(`\n📋 ${users.length} utilisateur(s) trouvé(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.role})`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Créé: ${user.createdAt.toLocaleDateString('fr-FR')}`);
      console.log('');
    });

    const admins = users.filter(u => u.role === 'admin');
    console.log(`\n👑 ${admins.length} administrateur(s) trouvé(s).`);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
