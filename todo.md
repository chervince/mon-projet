# TODO: Lancement Nouveau Projet Next.js Full-Stack

Basé sur la documentation dans `docs/`, voici les étapes pour lancer un nouveau projet Next.js vierge avec la stack décrite.

## Phase 1: Environnement Local (15 min)

### 1.1 Vérifier les prérequis
- [ ] Node.js >= 20.0.0 installé (`node --version`)
- [ ] pnpm installé (`pnpm --version`)
- [ ] Git configuré avec nom et email (`git config --global user.name` et `user.email`)

### 1.2 Créer le projet
- [ ] Créer un nouveau projet Next.js avec TypeScript, Tailwind, App Router, et import alias
  ```bash
  pnpm create next-app@latest mon-projet --typescript --tailwind --app --import-alias "@/*"
  cd mon-projet
  ```

### 1.3 Installer les dépendances core
- [ ] Installer toutes les dépendances (`pnpm install`)
- [ ] Ajouter les packages essentiels
  ```bash
  pnpm add @prisma/client next-auth@beta @auth/prisma-adapter zod
  pnpm add -D prisma tsx husky lint-staged prettier eslint-config-prettier
  ```

## Phase 2: Base de Données (10 min)

### 2.1 Créer la base de données
- [ ] Créer un projet Supabase (https://supabase.com)
- [ ] Récupérer les connection strings: `POSTGRES_PRISMA_URL` et `POSTGRES_URL_NON_POOLING`

### 2.2 Configurer Prisma
- [ ] Initialiser Prisma (`pnpm prisma init`)
- [ ] Éditer `prisma/schema.prisma` avec les modèles User, Account, Session, VerificationToken
- [ ] Créer la migration initiale (`pnpm prisma migrate dev --name init`)
- [ ] Générer le client Prisma (`pnpm prisma generate`)

## Phase 3: Variables d'Environnement (5 min)

### 3.1 Créer .env.local
- [ ] Copier le template (`cp .env.example .env.local`)
- [ ] Remplir les variables:
  - `POSTGRES_PRISMA_URL` et `POSTGRES_URL_NON_POOLING` depuis Supabase
  - `NEXTAUTH_SECRET` (générer avec `openssl rand -base64 32`)
  - `NEXTAUTH_URL="http://localhost:3000"`
  - `NEXT_PUBLIC_APP_URL="http://localhost:3000"`
  - `NODE_ENV="development"`
- [ ] Assurer que `.env.local` est dans `.gitignore`

## Phase 4: Configuration Outils (10 min)

### 4.1 TypeScript strict
- [ ] Configurer `tsconfig.json` avec options strictes, noImplicitAny, noUnusedLocals, etc., et paths "@/*": ["./src/*"]

### 4.2 ESLint + Prettier
- [ ] Créer `.prettierrc.json` avec semi: true, trailingComma: "es5", etc.

### 4.3 Husky + lint-staged
- [ ] Initialiser Husky (`pnpm exec husky init`)
- [ ] Créer pre-commit hook pour lint-staged
- [ ] Ajouter configuration lint-staged dans `package.json`

## Phase 5: Premier Déploiement (15 min)

### 5.1 Préparer Git
- [ ] Initialiser Git (`git init`)
- [ ] Premier commit (`git add . && git commit -m "chore: initial setup"`)
- [ ] Créer repo GitHub (`gh repo create mon-projet --public --source=. --remote=origin --push`)

### 5.2 Configurer Vercel
- [ ] Installer Vercel CLI (`pnpm add -g vercel`)
- [ ] Login Vercel (`vercel login`)
- [ ] Link le projet (`vercel link`)
- [ ] Ajouter les variables d'environnement sur Vercel (POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, NEXTAUTH_SECRET, NEXTAUTH_URL)

### 5.3 Déployer
- [ ] Déployer en production (`vercel --prod`)

## Phase 6: Validation Finale (5 min)

### 6.1 Tests Locaux
- [ ] Lancer en dev (`pnpm dev`) et vérifier http://localhost:3000
- [ ] Type-check (`pnpm type-check`)
- [ ] Lint (`pnpm lint`)

### 6.2 Tests Production
- [ ] Vérifier site Vercel accessible avec HTTPS
- [ ] Vérifier headers de sécurité
- [ ] Vérifier performance

## Prochaines Étapes
- [ ] Lire la documentation architecture
- [ ] Configurer NextAuth
- [ ] Appliquer les règles strictes
- [ ] Développer les fonctionnalités