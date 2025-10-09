#!/bin/bash

echo "🔄 Mise à jour des variables d'environnement depuis Vercel..."
echo ""

# Variables Supabase (à remplacer par tes vraies valeurs)
echo "# Supabase (depuis intégration Vercel)" > .env.local
echo "DATABASE_URL=\"postgres://[POSTGRES_USER]:[POSTGRES_PASSWORD]@[POSTGRES_HOST]:5432/[POSTGRES_DATABASE]\"" >> .env.local
echo "SUPABASE_URL=\"[SUPABASE_URL]\"" >> .env.local
echo "SUPABASE_ANON_KEY=\"[SUPABASE_ANON_KEY]\"" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=\"[SUPABASE_SERVICE_ROLE_KEY]\"" >> .env.local
echo "SUPABASE_JWT_SECRET=\"[SUPABASE_JWT_SECRET]\"" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=\"[NEXT_PUBLIC_SUPABASE_URL]\"" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=\"[NEXT_PUBLIC_SUPABASE_ANON_KEY]\"" >> .env.local

# Variables NextAuth (garder les mêmes)
echo "" >> .env.local
echo "# NextAuth" >> .env.local
echo "NEXTAUTH_SECRET=\"gRNCJkQyFMp/3rDdM1OTKm8HICUF+6cGtx7aSQMENhw=\"" >> .env.local
echo "NEXTAUTH_URL=\"http://localhost:3001\"" >> .env.local

# Variables app
echo "" >> .env.local
echo "# Application" >> .env.local
echo "NEXT_PUBLIC_APP_URL=\"http://localhost:3001\"" >> .env.local

echo ""
echo "✅ Fichier .env.local mis à jour avec le template !"
echo "🔧 Remplace les [VARIABLES] par tes vraies valeurs depuis Vercel Dashboard"
echo ""
echo "📋 Dans Vercel > Settings > Environment Variables, copie :"
echo "   - POSTGRES_USER"
echo "   - POSTGRES_PASSWORD" 
echo "   - POSTGRES_HOST"
echo "   - POSTGRES_DATABASE"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - SUPABASE_JWT_SECRET"
echo "   - NEXT_PUBLIC_SUPABASE_*"
