const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminSupabase() {
  console.log('\n🔐 Création d\'un administrateur via Supabase\n');
  console.log('⚠️  Vous aurez besoin de votre Service Role Key de Supabase\n');
  console.log('📍 Trouvez-la sur : Dashboard → Settings → API → Service Role Key\n');

  const supabaseUrl = await question('URL Supabase (ex: https://xxx.supabase.co): ');
  const serviceRoleKey = await question('Service Role Key: ');
  const email = await question('Email admin (ex: admin@neith.nc): ');
  const password = await question('Mot de passe: ');
  const name = await question('Nom (ex: Administrateur Neith): ');

  console.log('\n⏳ Création en cours...\n');

  try {
    // Étape 1 : Créer l'utilisateur dans auth.users
    console.log('1️⃣ Création de l\'utilisateur dans Supabase Auth...');

    const createUserResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirme l'email
        user_metadata: {
          name: name
        }
      }),
    });

    if (!createUserResponse.ok) {
      const error = await createUserResponse.text();
      console.error('❌ Erreur lors de la création:', error);
      rl.close();
      return;
    }

    const userData = await createUserResponse.json();
    const userId = userData.id;

    console.log(`✅ Utilisateur créé avec ID: ${userId}`);

    // Étape 2 : Insérer dans public.users
    console.log('\n2️⃣ Ajout dans la table public.users...');

    const insertResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: userId,
        email: email,
        name: name,
        role: 'admin',
        pointsTotal: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
    });

    if (!insertResponse.ok) {
      const error = await insertResponse.text();
      console.error('❌ Erreur lors de l\'insertion dans public.users:', error);
      console.log('\n💡 Essayez cette commande SQL manuellement:');
      console.log(`
INSERT INTO public.users (id, email, name, role, "pointsTotal", created_at, updated_at)
VALUES (
  '${userId}',
  '${email}',
  '${name}',
  'admin',
  0,
  NOW(),
  NOW()
);
      `);
      rl.close();
      return;
    }

    console.log('✅ Entrée créée dans public.users');

    // Résumé
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n👤 ID: ${userId}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`👑 Rôle: admin`);
    console.log(`📛 Nom: ${name}`);
    console.log('\n🎉 Vous pouvez maintenant vous connecter sur votre application !');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur réseau:', error.message);
  } finally {
    rl.close();
  }
}

createAdminSupabase();
