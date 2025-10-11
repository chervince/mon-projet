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

  let prodUrl = await question('URL de production (ex: https://mon-app.vercel.app): ');
  const email = await question('Email admin: ');
  const newPassword = await question('Nouveau mot de passe: ');
  const secretKey = await question('Clé secrète (ADMIN_RESET_SECRET): ');

  // Nettoyer l'URL (enlever le trailing slash)
  prodUrl = prodUrl.trim().replace(/\/$/, '');

  const apiUrl = `${prodUrl}/api/admin/reset-password-prod`;
  console.log(`\n⏳ Réinitialisation en cours sur: ${apiUrl}\n`);

  try {
    const requestBody = {
      email,
      newPassword,
      secretKey,
    };

    console.log('📤 Envoi de la requête...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    const text = await response.text();
    console.log('📥 Réponse brute:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('❌ Erreur: La réponse n\'est pas du JSON valide');
      console.error('   Réponse reçue:', text.substring(0, 200));
      rl.close();
      return;
    }

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
