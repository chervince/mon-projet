#!/usr/bin/env node

/**
 * Script pour vérifier la configuration NextAuth
 */

console.log('\n🔍 Vérification de la configuration NextAuth\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Variables d'environnement requises
const requiredEnvVars = [
  'AUTH_SECRET',
  'NEXTAUTH_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING'
];

let allPresent = true;

console.log('📋 Variables d\'environnement:\n');

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (value) {
    // Masquer les secrets
    const displayValue = envVar.includes('SECRET') || envVar.includes('URL')
      ? value.substring(0, 20) + '...'
      : value;
    console.log(`   ✅ ${envVar}: ${displayValue}`);
  } else {
    console.log(`   ❌ ${envVar}: MANQUANT`);
    allPresent = false;
  }
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allPresent) {
  console.log('✅ Toutes les variables d\'environnement sont présentes\n');
} else {
  console.log('❌ Il manque des variables d\'environnement\n');
  console.log('💡 Instructions:\n');
  console.log('   1. Vérifiez votre fichier .env.local');
  console.log('   2. Sur Vercel, allez dans Settings > Environment Variables');
  console.log('   3. Assurez-vous que AUTH_SECRET et NEXTAUTH_URL sont définis\n');
}

// Vérifier que NEXTAUTH_URL est bien configuré
if (process.env.NEXTAUTH_URL) {
  const url = process.env.NEXTAUTH_URL;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.log('⚠️  NEXTAUTH_URL doit commencer par http:// ou https://\n');
  }
}

console.log('📖 Pour Vercel:\n');
console.log('   AUTH_SECRET: <générer avec: openssl rand -base64 32>');
console.log('   NEXTAUTH_URL: https://mon-projet-mu.vercel.app\n');
