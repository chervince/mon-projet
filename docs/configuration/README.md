# ⚙️ Configuration du Projet

**Guides de configuration pour tous les outils**

---

## 📋 Vue d'ensemble

Cette section couvre la configuration de :

- **Next.js** : Framework principal
- **Prisma** : ORM et base de données
- **NextAuth.js** : Authentification
- **Vercel** : Déploiement
- **Variables d'environnement** : Secrets et config
- **Outils de qualité** : ESLint, Prettier, TypeScript

---

## 🗂️ Fichiers de configuration

### Fichiers de config par outil

| Outil | Fichier | Description |
|-------|---------|-------------|
| Next.js | `next.config.ts` | Config framework |
| TypeScript | `tsconfig.json` | Compilation TS |
| ESLint | `eslint.config.mjs` | Linting |
| Prettier | `.prettierrc.json` | Formatage |
| Prisma | `prisma/schema.prisma` | DB schema |
| Vercel | `vercel.json` | Déploiement |
| Git | `.gitignore` | Fichiers ignorés |
| Husky | `.husky/` | Git hooks |

---

## 📄 Guides détaillés

### 1. [Next.js Configuration](nextjs-config.md)

Configuration complète de `next.config.ts` :
- Headers de sécurité (CSP, HSTS)
- Optimisation images
- Variables d'environnement
- Redirections et rewrites
- Turbopack

### 2. [Prisma Setup](prisma-setup.md)

Setup base de données avec Prisma :
- Connexion à PostgreSQL
- Création du schema
- Migrations
- Seed data
- Prisma Client

### 3. [NextAuth Configuration](nextauth-setup.md)

Authentification avec NextAuth.js v5 :
- Providers (Credentials, Google, GitHub)
- Prisma Adapter
- Session strategy
- Callbacks
- Middleware protection

### 4. [Variables d'environnement](variables-environnement.md)

Gestion des secrets et config :
- Structure `.env.local`
- Variables par environnement
- Template `.env.example`
- Types TypeScript pour env vars

### 5. [Vercel Deployment](vercel-deployment.md)

Configuration Vercel :
- Link projet GitHub
- Environment variables
- Build settings
- Preview deployments
- Production domains

### 6. [Secrets Management](secrets-management.md)

Sécurité des secrets :
- Ne jamais commit de secrets
- Rotation des clés
- Vercel environment variables
- GitHub Secrets pour CI/CD

---

## 🚀 Configuration rapide

### Setup minimal (10 min)

1. **Next.js config** : Copier template `next.config.ts`
2. **TypeScript** : Config strict mode
3. **Prisma** : Init schema + connexion DB
4. **Variables d'env** : Créer `.env.local`
5. **ESLint/Prettier** : Copier configs
6. **Husky** : Setup pre-commit hooks

### Scripts NPM recommandés

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "lint:check": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "validate": "pnpm lint:check && pnpm type-check",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "prepare": "husky"
  }
}
```

---

## 🎯 Checklist de configuration

### Configuration de base

- [ ] `next.config.ts` créé avec headers de sécurité
- [ ] `tsconfig.json` en mode strict
- [ ] `eslint.config.mjs` configuré
- [ ] `.prettierrc.json` créé
- [ ] `.gitignore` complet
- [ ] `package.json` avec scripts

### Base de données

- [ ] `prisma/schema.prisma` créé
- [ ] Connexion DB testée
- [ ] Migration initiale appliquée
- [ ] Prisma Client généré
- [ ] Script seed créé

### Authentification

- [ ] NextAuth configuré
- [ ] Providers ajoutés
- [ ] Prisma Adapter configuré
- [ ] Middleware de protection créé
- [ ] Routes auth testées

### Variables d'environnement

- [ ] `.env.example` créé
- [ ] `.env.local` créé (local)
- [ ] Variables Vercel ajoutées (prod)
- [ ] Types TypeScript pour env
- [ ] Documentation des variables

### Déploiement

- [ ] Repo GitHub créé
- [ ] Vercel projet lié
- [ ] Variables env configurées
- [ ] Premier déploiement réussi
- [ ] Domain configuré

---

## 🛡️ Validation de la configuration

### Script de validation

```bash
#!/bin/bash
# validate-config.sh

echo "🔍 Validation de la configuration..."

# Vérifier fichiers requis
files=(
  "next.config.ts"
  "tsconfig.json"
  "eslint.config.mjs"
  ".prettierrc.json"
  "prisma/schema.prisma"
  ".env.example"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file manquant"
    exit 1
  fi
done

# Vérifier variables d'env
if [ ! -f ".env.local" ]; then
  echo "⚠️  .env.local manquant (copier depuis .env.example)"
fi

# Type-check
echo ""
echo "🔍 Type-check..."
pnpm type-check

# Lint
echo ""
echo "🔍 Lint..."
pnpm lint:check

# Prisma generate
echo ""
echo "🔍 Prisma Client..."
pnpm db:generate

echo ""
echo "✅ Configuration validée !"
```

---

## 📚 Templates

### next.config.ts minimal

```typescript
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ]
  },

  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/webp", "image/avif"],
  },
}

export default nextConfig
```

### tsconfig.json strict

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### .prettierrc.json

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "printWidth": 100
}
```

---

## 🔧 Troubleshooting

### Problème : TypeScript errors après installation

```bash
# Régénérer types Next.js
rm -rf .next
pnpm dev
```

### Problème : Prisma Client out of sync

```bash
# Régénérer client
pnpm db:generate
```

### Problème : ESLint config error

```bash
# Nettoyer cache ESLint
rm -rf .eslintcache
pnpm lint
```

---

**Prochaine étape** : Configurer votre environnement avec les guides détaillés
