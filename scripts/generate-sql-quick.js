const bcrypt = require('bcryptjs');

const email = process.argv[2] || 'admin@neith.nc';
const password = process.argv[3] || 'Anouwali_555';

if (!email || !password) {
  console.error('Usage: node generate-sql-quick.js <email> <password>');
  process.exit(1);
}

async function generatePasswordHash() {
  console.log('\n🔐 Génération du hash pour:', email);

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('\n✅ Hash généré!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Commande SQL à exécuter dans votre base de données:\n');
  console.log(`UPDATE users`);
  console.log(`SET password = '${hashedPassword}', role = 'admin'`);
  console.log(`WHERE email = '${email}';`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n📖 Instructions pour Supabase/PostgreSQL:\n');
  console.log('1. Allez sur votre dashboard Supabase (ou autre provider)');
  console.log('2. Cliquez sur "SQL Editor"');
  console.log('3. Créez une nouvelle query');
  console.log('4. Copiez-collez la commande SQL ci-dessus');
  console.log('5. Cliquez sur "Run" ou "Execute"');
  console.log('\n✅ Après exécution, vous pourrez vous connecter avec:');
  console.log(`   📧 Email: ${email}`);
  console.log(`   🔑 Mot de passe: ${password}`);
  console.log('\n');
}

generatePasswordHash();
