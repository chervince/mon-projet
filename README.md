# 🛒 Application de Fidélisation PME

Application web PWA moderne de fidélisation pour petits commerces et PME, développée avec Next.js 15.

## Règle Prioritaire

**Toujours prendre connaissance des informations contenues dans le dossier `docs` pour respecter la méthodologie de travail.**

Avant toute modification ou développement, veuillez lire la documentation dans `docs/` pour comprendre les méthodologies, meilleures pratiques et règles de ce projet.

## 📋 Description du Projet

Cette application permet aux utilisateurs de :
- Scanner des QR codes dans les points de vente
- Créer un compte et se connecter (email/mot de passe ou Google)
- Accumuler des points de fidélité lors de leurs achats
- Consulter leur solde de points
- Recevoir des récompenses automatiques

### Fonctionnalités principales :
- 🔐 **Authentification** : NextAuth.js avec credentials et Google OAuth
- 📱 **PWA** : Application installable et hors-ligne
- 🏪 **Gestion établissements** : Panel admin pour créer des commerces
- 📷 **Scan QR** : Accès rapide aux établissements
- 🎯 **Système de points** : Accumulation et suivi des récompenses
- 🎨 **Interface moderne** : Design responsive avec Tailwind CSS

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
pnpm build           # Build de production
pnpm start           # Serveur de production

# Tests
pnpm test            # Tests unitaires
pnpm test:coverage   # Tests avec couverture

# Base de données
pnpm prisma generate # Générer le client Prisma
pnpm prisma db push  # Pousser le schéma en DB
```

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connecter votre repo GitHub à Vercel
2. Variables d'environnement automatiques via Supabase
3. Déploiement automatique à chaque push

**URL de production** : https://mon-projet-mu.vercel.app/

### Variables d'environnement requises :
```env
# Supabase
DATABASE_URL=postgres://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...

# Application
NEXT_PUBLIC_APP_URL=https://...
```

## 🤝 Contribution

1. Lire la documentation dans `docs/`
2. Respecter les règles strictes de code
3. Tests avant chaque commit
4. Pull request avec description détaillée

## 📞 Support

- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Prisma** : https://www.prisma.io/docs
- **Documentation NextAuth** : https://authjs.dev

## 📄 Licence

Projet développé pour la fidélisation PME - Nouvelle-Calédonie
