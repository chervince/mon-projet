# ✅ Checklist de Démarrage Rapide

**Objectif : Projet fonctionnel en production en moins d'1h**

---

## 🎯 Vue d'ensemble

Cette checklist vous guide pour initialiser un projet Next.js full-stack prêt pour la production.
Chaque étape doit être validée avant de passer à la suivante.

**Durée estimée** : 45-60 minutes

---

## 📋 Phase 1 : Environnement local (15 min)

### 1.1 Vérifier les prérequis

```bash
# Node.js version 20+
node --version  # Doit afficher v20.x.x ou supérieur

# pnpm installé
pnpm --version  # Si absent : npm install -g pnpm

# Git configuré
git config --global user.name
git config --global user.email
```

**Validation** :
- [ ] Node.js >= 20.0.0
- [ ] pnpm installé
- [ ] Git configuré avec nom et email

### 1.2 Créer le projet

```bash
# Option A : Depuis un template GitHub
git clone <URL_DU_TEMPLATE> mon-projet
cd mon-projet

# Option B : Créer un nouveau projet Next.js
pnpm create next-app@latest mon-projet --typescript --tailwind --app --import-alias "@/*"
cd mon-projet
```

**Validation** :
- [ ] Dossier projet créé
- [ ] Fichiers Next.js présents
- [ ] package.json existe

### 1.3 Installer les dépendances core

```bash
# Installer toutes les dépendances
pnpm install

# Ajouter les packages essentiels
pnpm add @prisma/client next-auth@beta @auth/prisma-adapter zod
pnpm add -D prisma tsx husky lint-staged prettier eslint-config-prettier
```

**Validation** :
- [ ] node_modules/ créé
- [ ] Toutes les dépendances installées sans erreur

---

## 🗄️ Phase 2 : Base de données (10 min)

### 2.1 Créer la base de données

**Option recommandée : Supabase**

1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Choisir une région proche (ex: Singapore pour Pacifique)
4. Récupérer les connection strings :
   - `POSTGRES_PRISMA_URL` (pooling)
   - `POSTGRES_URL_NON_POOLING` (direct)

**Validation** :
- [ ] Projet Supabase créé
- [ ] Connection strings copiées

### 2.2 Configurer Prisma

```bash
# Initialiser Prisma
pnpm prisma init

# Le fichier prisma/schema.prisma est créé
```

Éditer `prisma/schema.prisma` :

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

generator client {
  provider = "prisma-client-js"
}

// Modèles de base
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime? @map("email_verified")
  name          String?
  image         String?
  password      String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  accounts Account[]
  sessions Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

```bash
# Créer la migration initiale
pnpm prisma migrate dev --name init

# Générer le client Prisma
pnpm prisma generate
```

**Validation** :
- [ ] Schema Prisma créé avec modèles de base
- [ ] Migration appliquée
- [ ] Client Prisma généré

---

## 🔐 Phase 3 : Variables d'environnement (5 min)

### 3.1 Créer .env.local

```bash
# Copier le template
cp .env.example .env.local
```

### 3.2 Remplir les variables

```env
# Database (depuis Supabase)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# NextAuth (générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET="votre-secret-aleatoire-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Validation** :
- [ ] .env.local créé
- [ ] Variables database configurées
- [ ] NEXTAUTH_SECRET généré
- [ ] .env.local dans .gitignore

---

## ⚙️ Phase 4 : Configuration outils (10 min)

### 4.1 TypeScript strict

Créer/éditer `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4.2 ESLint + Prettier

Créer `.prettierrc.json` :

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### 4.3 Husky + lint-staged

```bash
# Initialiser Husky
pnpm exec husky init

# Créer pre-commit hook
echo '#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
' > .husky/pre-commit

chmod +x .husky/pre-commit
```

Ajouter à `package.json` :

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

**Validation** :
- [ ] tsconfig.json configuré en mode strict
- [ ] Prettier configuré
- [ ] Husky hooks créés
- [ ] lint-staged configuré

---

## 🚀 Phase 5 : Premier déploiement (15 min)

### 5.1 Préparer Git

```bash
# Initialiser Git (si pas déjà fait)
git init

# Premier commit
git add .
git commit -m "chore: initial setup"

# Créer repo GitHub
gh repo create mon-projet --public --source=. --remote=origin --push
```

### 5.2 Configurer Vercel

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Login Vercel
vercel login

# Link le projet
vercel link

# Ajouter les variables d'environnement
vercel env add POSTGRES_PRISMA_URL
vercel env add POSTGRES_URL_NON_POOLING
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL  # https://votre-projet.vercel.app
```

### 5.3 Déployer

```bash
# Deploy en production
vercel --prod
```

**Validation** :
- [ ] Repo GitHub créé
- [ ] Projet Vercel configuré
- [ ] Variables d'env ajoutées à Vercel
- [ ] Déploiement production réussi
- [ ] Site accessible en HTTPS

---

## ✅ Phase 6 : Validation finale (5 min)

### 6.1 Tests locaux

```bash
# Lancer en dev
pnpm dev
# Ouvrir http://localhost:3000

# Type-check
pnpm type-check

# Lint
pnpm lint
```

**Validation** :
- [ ] Dev server démarre sans erreur
- [ ] Page d'accueil s'affiche
- [ ] Type-check passe
- [ ] Lint passe

### 6.2 Tests production

- [ ] Site Vercel accessible
- [ ] HTTPS actif
- [ ] Headers de sécurité (vérifier avec https://securityheaders.com)
- [ ] Performance acceptable (vérifier avec PageSpeed Insights)

---

## 🎉 Félicitations !

Votre projet Next.js est maintenant :

- ✅ Configuré avec TypeScript strict
- ✅ Connecté à une base de données PostgreSQL
- ✅ Sécurisé avec NextAuth.js
- ✅ Déployé en production sur Vercel
- ✅ Prêt pour le développement

## 📚 Prochaines étapes

1. **Architecture** : Lire [../architecture/structure-projet.md](../architecture/structure-projet.md)
2. **Authentification** : Configurer [../configuration/nextauth-setup.md](../configuration/nextauth-setup.md)
3. **Règles strictes** : Appliquer [../regles-strictes/conventions-code.md](../regles-strictes/conventions-code.md)
4. **Features** : Développer vos fonctionnalités

---

**⏱️ Durée totale : ~60 minutes**
**🎯 Prêt pour la production : ✅**
