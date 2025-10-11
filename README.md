# 🎯 Neith Consulting - Application de Fidélisation

Application web PWA de fidélisation pour les entreprises de Nouvelle-Calédonie, développée par **Neith Consulting**.

## Règle Prioritaire

**Toujours prendre connaissance du fichier `CLAUDE.md` pour respecter l'architecture et la méthodologie de travail.**

Avant toute modification ou développement, veuillez lire `CLAUDE.md` et `details_application.md` pour comprendre le contexte business, l'architecture technique et les règles de ce projet.

## 📋 Description du Projet

Application PWA permettant aux commerçants partenaires (gérés par Neith via abonnement) d'offrir un programme de fidélité moderne à leurs clients.

Les utilisateurs :

- Créent un compte et se connectent (email/mot de passe)
- Scannent leurs tickets de caisse en magasin
- Accumulent des **crédits en XPF** (Franc Pacifique) par marchand
- Reçoivent automatiquement des **bons d'achat** lorsqu'ils atteignent le seuil
- Utilisent leurs bons en caisse via QR code ou code marchand

### Fonctionnalités principales :

- 🔐 **Authentification** : NextAuth.js v5 avec credentials (email/password)
- 📱 **PWA** : Application installable avec support offline
- 🏪 **Gestion marchands** : Panel admin pour créer et paramétrer les commerces
- 📷 **Scan tickets** : OCR Google Cloud Vision pour extraction montant et reconnaissance marchand
- 💰 **Système de crédits XPF** : Accumulation par marchand avec seuil déclencheur
- 🎟️ **Bons d'achat automatiques** : Génération et validation via QR code
- ⏰ **Expiration paramétrable** : Alertes push J-20 et J-1
- 🎨 **Interface moderne** : Design responsive avec Tailwind CSS, adapté au contexte NC

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- pnpm
- PostgreSQL (via Supabase)

### Installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd mon-projet
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer l'environnement**

```bash
cp .env.local.example .env.local
# Éditer .env.local avec vos vraies valeurs Supabase
```

4. **Démarrer le serveur de développement**

```bash
pnpm dev
```

5. **Accéder à l'application**
   Ouvrez [http://localhost:3000](http://localhost:3000)

### Tests

```bash
# Tests unitaires et d'intégration
pnpm test

# Tests avec couverture
pnpm test:coverage
```

## 🏗️ Architecture Technique

### Stack Principal

- **Framework** : Next.js 15 (App Router)
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js v5
- **Styling** : Tailwind CSS
- **Déploiement** : Vercel
- **Langage** : TypeScript strict

### Structure du projet

```
mon-projet/
├── docs/                 # Documentation complète
├── prisma/              # Schéma base de données
├── src/
│   ├── app/            # Pages Next.js (App Router)
│   ├── components/     # Composants réutilisables
│   ├── lib/           # Utilitaires et configurations
│   └── types/         # Types TypeScript
├── public/             # Assets statiques
└── tests/              # Tests automatisés
```

## 📚 Documentation

Consultez le dossier `docs/` pour :

- **Vue d'ensemble** : Stack technique et objectifs
- **Quickstart** : Guide de démarrage rapide
- **Architecture** : Principes d'architecture et patterns
- **Configuration** : Setup des outils (Next.js, Prisma, Vercel)
- **Règles strictes** : Conventions non-négociables
- **Recommandations** : Bonnes pratiques suggérées
- **Tests** : Stratégie de tests complète

## 🔧 Scripts Disponibles

```bash
# Développement
pnpm dev              # Serveur de développement
pnpm build           # Build de production (inclut prisma generate)
pnpm start           # Serveur de production
pnpm lint            # Linter ESLint
pnpm type-check      # Vérification TypeScript

# Tests
pnpm test            # Tests unitaires
pnpm test:coverage   # Tests avec couverture

# Base de données
pnpm prisma generate # Générer le client Prisma
pnpm prisma db push  # Pousser le schéma en DB
pnpm prisma studio   # Interface graphique Prisma

# Administration
pnpm admin:create-supabase      # Créer un admin via Supabase Auth
pnpm admin:reset-password       # Reset password admin (local)
pnpm admin:reset-password-prod  # Reset password admin (prod)
pnpm admin:list-users           # Lister tous les users
pnpm admin:debug-login          # Déboguer les credentials
pnpm admin:check-config         # Vérifier les variables NextAuth
```

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connecter votre repo GitHub à Vercel
2. Variables d'environnement automatiques via Supabase
3. Déploiement automatique à chaque push

**URL de production** : https://mon-projet-mu.vercel.app/

### Variables d'environnement requises :

```env
# Supabase/PostgreSQL
POSTGRES_PRISMA_URL=postgres://...         # Pooling connection
POSTGRES_URL_NON_POOLING=postgres://...    # Direct connection
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...

# NextAuth v5
AUTH_SECRET=<générer avec: openssl rand -base64 32>
NEXTAUTH_URL=https://mon-projet-mu.vercel.app

# Application
NEXT_PUBLIC_APP_URL=https://mon-projet-mu.vercel.app

# Google Cloud Vision (à venir)
GOOGLE_CLOUD_VISION_API_KEY=xxx
```

## 🤝 Contribution

1. Lire `CLAUDE.md` et `details_application.md`
2. Respecter les règles strictes de code
3. Tests avant chaque commit (husky pre-commit hook)
4. Pull request avec description détaillée

## 📖 Documentation Technique

- **CLAUDE.md** : Architecture complète, business logic, patterns
- **details_application.md** : Brief du projet et spécifications fonctionnelles
- **todo_appli.md** : Roadmap détaillée des features à implémenter

## 📞 Support & Ressources

- **Documentation Next.js 15** : https://nextjs.org/docs
- **Documentation Prisma** : https://www.prisma.io/docs
- **Documentation NextAuth v5** : https://authjs.dev
- **Google Cloud Vision API** : https://cloud.google.com/vision/docs

## 📄 Licence

© 2025 Neith Consulting - Application de fidélisation pour les entreprises de Nouvelle-Calédonie
