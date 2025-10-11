const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generatePasswordHash() {
  console.log('\n🔐 Générateur de hash de mot de passe\n');

  const email = await question('Email de l\'utilisateur: ');
  const password = await question('Nouveau mot de passe: ');

  console.log('\n⏳ Génération du hash...\n');

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('✅ Hash généré avec succès!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Commande SQL à exécuter dans votre base de données:\n');
  console.log(`UPDATE "User"`);
  console.log(`SET password = '${hashedPassword}', role = 'admin'`);
  console.log(`WHERE email = '${email}';`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n📖 Instructions:\n');
  console.log('1. Connectez-vous à votre base de données (Supabase, Vercel Postgres, etc.)');
  console.log('2. Ouvrez l\'éditeur SQL');
  console.log('3. Copiez-collez la commande SQL ci-dessus');
  console.log('4. Exécutez la requête');
  console.log('5. Vous pourrez vous connecter avec:');
  console.log(`   Email: ${email}`);
  console.log(`   Mot de passe: ${password}`);

  rl.close();
}

generatePasswordHash();
