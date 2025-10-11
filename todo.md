# TODO: Lancement Nouveau Projet Next.js Full-Stack

Basé sur la documentation dans `docs/`, voici les étapes pour lancer un nouveau projet Next.js vierge avec la stack décrite.

## Phase 1: Environnement Local (15 min)

### 1.1 Vérifier les prérequis

- [x] Node.js >= 20.0.0 installé (`node --version`)
- [x] pnpm installé (`pnpm --version`)
- [x] Git configuré avec nom et email (`git config --global user.name` et `user.email`)

### 1.2 Créer le projet

- [x] Créer un nouveau projet Next.js avec TypeScript, Tailwind, App Router, et import alias
  ```bash
  pnpm create next-app@latest mon-projet --typescript --tailwind --app --import-alias "@/*"
  cd mon-projet
  ```

### 1.3 Installer les dépendances core

- [x] Installer toutes les dépendances (`pnpm install`)
- [x] Ajouter les packages essentiels
  ```bash
  pnpm add @prisma/client next-auth@beta @auth/prisma-adapter zod
  pnpm add -D prisma tsx husky lint-staged prettier eslint-config-prettier
  ```

## Phase 2: Base de Données (10 min)

### 2.1 Créer la base de données

- [x] Créer un projet Supabase (https://supabase.com)
- [x] Récupérer les connection strings: `POSTGRES_PRISMA_URL` et `POSTGRES_URL_NON_POOLING`

### 2.2 Configurer Prisma

- [x] Initialiser Prisma (`pnpm prisma init`)
- [x] Éditer `prisma/schema.prisma` avec les modèles User, Account, Session, Establishment
- [x] Créer la migration initiale (`pnpm prisma migrate dev --name init`)
- [x] Générer le client Prisma (`pnpm prisma generate`)
- [x] Configuration binary targets pour Vercel (rhel-openssl-3.0.x)

## Phase 3: Variables d'Environnement (5 min)

### 3.1 Créer .env.local

- [x] Copier le template (`cp .env.example .env.local`)
- [x] Remplir les variables:
  - `POSTGRES_PRISMA_URL` et `POSTGRES_URL_NON_POOLING` depuis Supabase
  - `AUTH_SECRET` (générer avec `openssl rand -base64 32`)
  - `NEXTAUTH_URL="http://localhost:3000"`
  - `NEXT_PUBLIC_APP_URL="http://localhost:3000"`
  - `NODE_ENV="development"`
- [x] Assurer que `.env.local` est dans `.gitignore`

## Phase 4: Configuration Outils (10 min)

### 4.1 TypeScript strict

- [x] Configurer `tsconfig.json` avec options strictes, noImplicitAny, noUnusedLocals, etc., et paths "@/_": ["./src/_"]

### 4.2 ESLint + Prettier

- [x] Créer `.prettierrc.json` avec semi: true, trailingComma: "es5", etc.

### 4.3 Husky + lint-staged

- [x] Initialiser Husky (`pnpm exec husky init`)
- [x] Créer pre-commit hook pour lint-staged
- [x] Ajouter configuration lint-staged dans `package.json`

## Phase 5: Premier Déploiement (15 min)

### 5.1 Préparer Git

- [x] Initialiser Git (`git init`)
- [x] Premier commit (`git add . && git commit -m "chore: initial setup"`)
- [x] Créer repo GitHub et push

### 5.2 Configurer Vercel

- [x] Connecter repo GitHub à Vercel
- [x] Ajouter les variables d'environnement sur Vercel (POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, AUTH_SECRET, NEXTAUTH_URL)

### 5.3 Déployer

- [x] Déployer en production (automatique via GitHub)
- [x] URL de production: https://mon-projet-mu.vercel.app/

## Phase 6: Validation Finale (5 min)

### 6.1 Tests Locaux

- [x] Lancer en dev (`pnpm dev`) et vérifier http://localhost:3000
- [x] Type-check (`pnpm type-check`)
- [x] Lint (`pnpm lint`)

### 6.2 Tests Production

- [x] Vérifier site Vercel accessible avec HTTPS
- [ ] Vérifier headers de sécurité
- [ ] Vérifier performance

## Prochaines Étapes

- [x] Lire la documentation architecture (CLAUDE.md)
- [x] Configurer NextAuth v5
- [x] Créer admin dashboard
- [x] Créer user dashboard
- [ ] Développer les fonctionnalités (voir todo_appli.md)
