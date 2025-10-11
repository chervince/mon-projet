const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugLogin() {
  const email = process.argv[2] || 'chervince@gmail.com';
  const password = process.argv[3] || 'Anouwali_555';

  console.log('\n🔍 Debug de connexion pour:', email);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Vérifier si l'utilisateur existe
    console.log('1️⃣ Recherche de l\'utilisateur dans la base de données...');
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log('❌ ERREUR: Utilisateur non trouvé dans la base de données');
      console.log('   Email recherché:', email);
      console.log('\n💡 Vérifiez que l\'email est correct dans public.users');
      return;
    }

    console.log('✅ Utilisateur trouvé !');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Nom:', user.name);
    console.log('   Rôle:', user.role);
    console.log('   Password existe:', !!user.password);

    if (user.password) {
      console.log('   Password hash (premiers 20 chars):', user.password.substring(0, 20) + '...');
    }

    // 2. Vérifier le mot de passe
    console.log('\n2️⃣ Vérification du mot de passe...');

    if (!user.password) {
      console.log('❌ ERREUR: Aucun mot de passe dans la base de données');
      console.log('   L\'utilisateur n\'a pas de champ password rempli');
      console.log('\n💡 Exécutez cette commande SQL:');
      const hash = await bcrypt.hash(password, 10);
      console.log(`
UPDATE public.users
SET password = '${hash}'
WHERE email = '${email}';
      `);
      return;
    }

    // 3. Tester le hash du mot de passe
    console.log('   Mot de passe à tester:', password);
    console.log('   Hash stocké:', user.password);

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      console.log('✅ Mot de passe VALIDE !');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ L\'authentification devrait FONCTIONNER');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔑 Identifiants de connexion:');
      console.log(`   Email: ${email}`);
      console.log(`   Mot de passe: ${password}`);
      console.log(`   Rôle: ${user.role}`);
    } else {
      console.log('❌ ERREUR: Mot de passe INVALIDE');
      console.log('   Le hash ne correspond pas au mot de passe fourni');
      console.log('\n💡 Régénérez le hash avec:');
      console.log(`   node scripts/generate-sql-quick.js ${email} ${password}`);
    }

    // 4. Vérifier la configuration
    console.log('\n3️⃣ Vérifications supplémentaires...');

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
      }
    });

    console.log(`   Nombre total d'utilisateurs: ${allUsers.length}`);
    allUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.email} (${u.role}) - Password: ${!!u.password ? 'OUI' : 'NON'}`);
    });

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('   Détails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
