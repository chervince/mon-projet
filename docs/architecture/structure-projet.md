# 📁 Structure du Projet

**Arborescence complète d'un projet Next.js full-stack**

---

## 🌳 Vue d'ensemble

```
mon-projet/
├── 📁 prisma/              # Schema et migrations base de données
├── 📁 public/              # Fichiers statiques
├── 📁 src/                 # Code source application
│   ├── 📁 app/            # Next.js App Router
│   ├── 📁 components/     # Composants React réutilisables
│   ├── 📁 lib/            # Logique métier, utils, config
│   └── 📁 types/          # Types TypeScript globaux
├── 📁 scripts/            # Scripts utilitaires
├── 📁 docs/               # Documentation projet
├── 📄 .env.local          # Variables d'environnement (local)
├── 📄 .env.example        # Template variables d'environnement
├── 📄 next.config.ts      # Configuration Next.js
├── 📄 tsconfig.json       # Configuration TypeScript
├── 📄 package.json        # Dépendances et scripts
└── 📄 README.md           # Documentation principale
```

---

## 📂 Détail des dossiers

### 1. `prisma/` - Base de données

```
prisma/
├── schema.prisma          # Schéma Prisma (modèles, relations)
├── migrations/            # Migrations SQL générées
│   └── 20240101_init/
│       └── migration.sql
└── seed.ts                # Script pour peupler la DB
```

**Fichiers clés** :

- `schema.prisma` : Définit les modèles (User, Event, etc.)
- `migrations/` : Historique des changements de schema
- `seed.ts` : Données initiales pour dev/test

---

### 2. `public/` - Fichiers statiques

```
public/
├── favicon.ico
├── logo.svg
├── images/
│   └── placeholder.png
├── fonts/
│   └── custom-font.woff2
└── manifest.json          # PWA manifest
```

**Accessible via** : `/logo.svg` → `https://site.com/logo.svg`

---

### 3. `src/app/` - Next.js App Router

```
src/app/
├── layout.tsx             # Layout racine (obligatoire)
├── page.tsx               # Page d'accueil (/)
├── globals.css            # Styles globaux
├── not-found.tsx          # Page 404
├── error.tsx              # Page erreur générique
│
├── (marketing)/           # Route group (pas d'URL)
│   ├── layout.tsx
│   ├── page.tsx           # /
│   ├── about/
│   │   └── page.tsx       # /about
│   └── contact/
│       └── page.tsx       # /contact
│
├── (app)/                 # Route group authentifié
│   ├── layout.tsx         # Layout avec sidebar
│   ├── dashboard/
│   │   └── page.tsx       # /dashboard
│   ├── profile/
│   │   └── page.tsx       # /profile
│   └── settings/
│       └── page.tsx       # /settings
│
├── admin/                 # Section admin
│   ├── layout.tsx
│   ├── page.tsx           # /admin
│   ├── users/
│   │   ├── page.tsx       # /admin/users
│   │   └── [id]/
│   │       └── page.tsx   # /admin/users/:id
│   └── events/
│       └── page.tsx       # /admin/events
│
├── api/                   # API Routes
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts   # NextAuth endpoints
│   ├── events/
│   │   └── route.ts       # GET/POST /api/events
│   └── upload/
│       └── route.ts       # POST /api/upload
│
└── [locale]/              # i18n (optionnel)
    └── page.tsx           # /en, /fr, etc.
```

**Conventions** :

- `layout.tsx` : Layout partagé entre pages enfants
- `page.tsx` : Page accessible via URL
- `loading.tsx` : UI de chargement (Suspense boundary)
- `error.tsx` : Gestion d'erreurs
- `not-found.tsx` : Page 404 personnalisée
- `route.ts` : API Route Handler
- `(folder)/` : Route group (n'affecte pas l'URL)
- `[param]/` : Route dynamique

---

### 4. `src/components/` - Composants React

```
src/components/
├── ui/                    # Composants UI primitifs
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── modal.tsx
│   └── button.module.css
│
├── forms/                 # Formulaires
│   ├── login-form.tsx
│   ├── event-form.tsx
│   └── contact-form.tsx
│
├── layout/                # Composants de layout
│   ├── header.tsx
│   ├── footer.tsx
│   ├── sidebar.tsx
│   └── navigation.tsx
│
├── features/              # Composants métier
│   ├── events/
│   │   ├── event-card.tsx
│   │   ├── event-list.tsx
│   │   └── event-filters.tsx
│   ├── auth/
│   │   ├── login-button.tsx
│   │   └── user-menu.tsx
│   └── admin/
│       └── admin-table.tsx
│
└── providers/             # Context Providers
    ├── query-provider.tsx # TanStack Query
    ├── auth-provider.tsx  # Auth context
    └── theme-provider.tsx # Theme switcher
```

**Conventions de nommage** :

- `kebab-case` pour les fichiers
- `PascalCase` pour les composants
- `*.module.css` pour CSS Modules
- Un composant = un fichier (sauf composants très simples)

---

### 5. `src/lib/` - Logique métier et utils

```
src/lib/
├── prisma.ts              # Instance Prisma Client
├── auth.ts                # Configuration NextAuth
├── validation.ts          # Schémas Zod
│
├── actions/               # Server Actions
│   ├── events.ts
│   ├── auth.ts
│   └── users.ts
│
├── api/                   # API clients
│   ├── events-api.ts
│   └── upload-api.ts
│
├── services/              # Services métier
│   ├── email.ts           # Service d'emailing
│   ├── storage.ts         # Upload fichiers (Cloudinary)
│   └── analytics.ts       # Tracking
│
├── utils/                 # Fonctions utilitaires
│   ├── cn.ts              # classNames merge
│   ├── format-date.ts
│   ├── slugify.ts
│   └── constants.ts       # Constantes app
│
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts
│   ├── use-media-query.ts
│   └── use-debounce.ts
│
└── store/                 # State management (Zustand)
    ├── ui-store.ts
    └── user-store.ts
```

**Fichiers clés** :

- `prisma.ts` : Singleton Prisma Client
- `auth.ts` : Configuration NextAuth complète
- `validation.ts` : Schémas Zod réutilisables
- `actions/` : Server Actions groupées par domaine
- `services/` : Logique métier complexe

---

### 6. `src/types/` - Types TypeScript

```
src/types/
├── index.ts               # Types globaux
├── api.ts                 # Types réponses API
├── database.ts            # Types dérivés Prisma
└── env.d.ts               # Types variables d'env
```

**Exemple `index.ts`** :

```typescript
export type UserRole = 'USER' | 'ADMIN'

export interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
```

---

### 7. `scripts/` - Scripts utilitaires

```
scripts/
├── seed.ts                # Peupler la DB
├── migrate.ts             # Migrations custom
├── check-env.sh           # Vérifier variables d'env
└── build-sitemap.ts       # Générer sitemap.xml
```

---

### 8. Configuration racine

```
mon-projet/
├── .env.local             # Variables dev (JAMAIS commit)
├── .env.example           # Template variables
├── .gitignore             # Fichiers ignorés par Git
├── .prettierrc.json       # Config Prettier
├── .prettierignore        # Fichiers ignorés par Prettier
├── .eslintrc.json         # Config ESLint
├── next.config.ts         # Config Next.js
├── tsconfig.json          # Config TypeScript
├── package.json           # Dépendances
├── pnpm-lock.yaml         # Lock file pnpm
├── vercel.json            # Config Vercel (optionnel)
└── README.md              # Documentation
```

---

## 📏 Règles de structuration

### 1. Colocation

**Garder les fichiers liés proches** :

```
✅ BON
src/components/events/
├── event-card.tsx
├── event-card.module.css
├── event-card.test.tsx
└── use-event-card.ts

❌ MAUVAIS
src/components/event-card.tsx
src/styles/event-card.module.css
src/tests/event-card.test.tsx
src/hooks/use-event-card.ts
```

### 2. Index files

**Utiliser `index.ts` pour simplifier les imports** :

```typescript
// src/components/ui/index.ts
export { Button } from './button'
export { Input } from './input'
export { Card } from './card'

// Usage
import { Button, Input, Card } from '@/components/ui'
```

### 3. Barrel exports

**Éviter les barrel exports massifs** (problèmes de performance)

```typescript
❌ ÉVITER
// src/components/index.ts
export * from './ui'
export * from './forms'
export * from './layout'
// => Import tout même si on utilise 1 composant

✅ PRÉFÉRER
// Imports spécifiques
import { Button } from '@/components/ui/button'
```

### 4. Aliases TypeScript

Configurer dans `tsconfig.json` :

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

---

## 🎯 Structure par feature (Alternative)

Pour les grandes applications :

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── events/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   ├── types.ts
│   │   └── index.ts
│   └── admin/
│       └── ...
└── shared/
    ├── components/
    ├── hooks/
    └── utils/
```

---

## ✅ Checklist

- [ ] Structure de base créée
- [ ] Dossiers `prisma/`, `src/app/`, `src/components/`, `src/lib/` présents
- [ ] Aliases TypeScript configurés (`@/*`)
- [ ] `README.md` à jour avec structure du projet
- [ ] `.gitignore` complet (node_modules, .env.local, .next)

---

**Prochaine étape** : [conventions-nommage.md](conventions-nommage.md)
