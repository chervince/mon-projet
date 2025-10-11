const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function resetProductionPassword() {
  console.log('\n🔐 Réinitialisation du mot de passe admin en PRODUCTION\n');
  console.log('⚠️  ATTENTION : Cette action modifiera la base de données de production!\n');

  const prodUrl = await question('URL de production (ex: https://mon-app.vercel.app): ');
  const email = await question('Email admin: ');
  const newPassword = await question('Nouveau mot de passe: ');
  const secretKey = await question('Clé secrète (ADMIN_RESET_SECRET): ');

  console.log('\n⏳ Réinitialisation en cours...\n');

  try {
    const response = await fetch(`${prodUrl}/api/admin/reset-password-prod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        newPassword,
        secretKey,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Mot de passe réinitialisé avec succès!');
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Nom: ${data.user.name}`);
      console.log(`   Rôle: ${data.user.role}`);
      console.log(`\n🔑 Nouveau mot de passe: ${newPassword}`);
      console.log('\n⚠️  N\'oubliez pas de supprimer la route API après utilisation!');
    } else {
      console.error('❌ Erreur:', data.error);
      if (data.details) {
        console.error('   Détails:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error.message);
  } finally {
    rl.close();
  }
}

resetProductionPassword();
