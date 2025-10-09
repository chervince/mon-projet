# 🤖 Intégration de l'Agent IA

**Guide pour utiliser Claude Code dans votre workflow de développement**

---

## 🎯 Objectifs

L'agent IA (Claude Code) peut :

- ✅ **Setup initial** du projet en <1h
- ✅ **Générer du code** respectant les conventions
- ✅ **Détecter les bugs** et problèmes de sécurité
- ✅ **Refactorer** le code selon les best practices
- ✅ **Créer des tests** automatiquement
- ✅ **Documenter** le code
- ✅ **Optimiser** les performances

---

## 📋 Fonctionnement

### 1. Contexte fourni à l'agent

L'agent doit avoir accès à :

```
projet/
├── doc_projet_nextjs/       # Cette documentation
├── README.md                 # Documentation projet
├── package.json              # Dépendances et scripts
├── tsconfig.json             # Config TypeScript
├── prisma/schema.prisma      # Schema DB
└── src/                      # Code source
```

### 2. Instructions systèmes

Créer `.claude/instructions.md` :

```markdown
# Instructions pour Claude Code

## Contexte du projet

Projet Next.js 15 full-stack avec :
- TypeScript strict
- Prisma + PostgreSQL
- NextAuth.js v5
- TanStack Query + Zustand
- Déploiement Vercel

## Règles strictes

1. **TypeScript strict mode** : Jamais de `any`, types explicites
2. **Validation Zod** : Toutes entrées utilisateur validées
3. **Server Components** : Par défaut, `use client` uniquement si nécessaire
4. **Error handling** : Try/catch pour tout code async
5. **Performance** : Images via next/image, lazy loading

## Conventions

- **Fichiers** : kebab-case (ex: `user-profile.tsx`)
- **Composants** : PascalCase (ex: `UserProfile`)
- **Fonctions** : camelCase (ex: `getUserProfile`)
- **Types** : PascalCase (ex: `UserProfile`)

## Workflow

1. Lire la documentation dans `doc_projet_nextjs/`
2. Appliquer les règles strictes
3. Valider avec `pnpm lint && pnpm type-check`
4. Créer des commits atomiques
5. Documenter les changements

## Limites

- Ne jamais commit de secrets
- Ne jamais bypasser la validation
- Ne jamais utiliser `any` sans justification
- Toujours créer des tests pour la logique critique
```

---

## 🚀 Workflows automatisés

### Workflow 1 : Setup initial

**Prompt** :

```
Je veux créer un nouveau projet Next.js full-stack.

Objectifs :
- Setup complet en <1h
- TypeScript strict
- Prisma + PostgreSQL (Supabase)
- NextAuth.js v5
- Déploiement Vercel

Suis la documentation dans doc_projet_nextjs/quickstart/
```

**Actions de l'agent** :
1. Créer projet Next.js
2. Installer dépendances (Prisma, NextAuth, etc.)
3. Configurer TypeScript strict
4. Setup Prisma + connexion DB
5. Configurer NextAuth
6. Setup ESLint + Prettier + Husky
7. Premier déploiement Vercel
8. Valider installation

---

### Workflow 2 : Créer une nouvelle feature

**Prompt** :

```
Créer une feature "Blog" avec :
- Modèle Prisma BlogPost
- CRUD API via Server Actions
- Pages :
  - /blog (liste)
  - /blog/[slug] (article)
  - /admin/blog (gestion)
- Validation Zod
- Tests unitaires

Respecter les règles strictes dans doc_projet_nextjs/regles-strictes/
```

**Actions de l'agent** :
1. Créer modèle Prisma `BlogPost`
2. Générer migration
3. Créer schémas Zod
4. Créer Server Actions
5. Créer pages Next.js
6. Créer composants
7. Ajouter tests
8. Valider (lint + type-check)

---

### Workflow 3 : Code Review automatique

**Prompt** :

```
Analyse le code du PR #42 et vérifie :
- Respect des règles strictes
- Sécurité (validation, secrets)
- Performance (bundle size, images)
- Tests présents
- Documentation à jour

Génère un rapport avec recommandations.
```

**Actions de l'agent** :
1. Lire les fichiers modifiés
2. Vérifier règles strictes
3. Analyser sécurité
4. Vérifier tests
5. Générer rapport markdown

---

### Workflow 4 : Debugging

**Prompt** :

```
J'ai une erreur :
[ERREUR]

Contexte : [CONTEXTE]

Aide-moi à :
1. Identifier la cause
2. Proposer un fix
3. Ajouter un test pour éviter la régression
```

**Actions de l'agent** :
1. Analyser l'erreur
2. Lire le code concerné
3. Identifier la cause racine
4. Proposer solution
5. Créer test de non-régression

---

## 🎨 Prompts système

### Prompt de base

```markdown
Tu es un expert développeur Next.js spécialisé en :
- Next.js 15+ App Router
- React 19 Server Components
- TypeScript strict
- Prisma ORM
- NextAuth.js v5
- Architecture full-stack moderne

Documentation disponible : doc_projet_nextjs/

Règles strictes à respecter :
1. TypeScript strict (pas de any)
2. Validation Zod obligatoire
3. Error handling systématique
4. Tests pour logique critique
5. Performance optimisée

Avant toute action :
1. Lire la documentation pertinente
2. Vérifier les règles strictes
3. Appliquer les conventions
4. Valider le code (lint + type-check)
```

### Prompt pour features

```markdown
Créer une feature complète :

1. **Analyse** :
   - Lire les specs
   - Identifier les composants nécessaires
   - Planifier l'architecture

2. **Implémentation** :
   - Modèles Prisma (si DB)
   - Schémas Zod (validation)
   - Server Actions (mutations)
   - Composants React
   - Pages Next.js

3. **Qualité** :
   - Tests unitaires
   - Error handling
   - Loading states
   - Documentation

4. **Validation** :
   - pnpm lint
   - pnpm type-check
   - pnpm test
   - Performance check
```

---

## 📊 Validation par l'agent

### Script de validation automatique

L'agent peut exécuter :

```bash
# validate.sh
#!/bin/bash

echo "🔍 Validation du code..."

# Type-check
echo "📝 TypeScript..."
pnpm type-check || exit 1

# Lint
echo "🔍 ESLint..."
pnpm lint:check || exit 1

# Format
echo "✨ Prettier..."
pnpm format:check || exit 1

# Tests
echo "🧪 Tests..."
pnpm test || exit 1

# Build
echo "🏗️ Build..."
pnpm build || exit 1

echo "✅ Validation réussie !"
```

---

## 🎯 Checklist pour l'agent

Avant de considérer une tâche terminée :

- [ ] Code conforme aux règles strictes
- [ ] TypeScript strict respecté (0 erreur)
- [ ] Validation Zod en place
- [ ] Error handling complet
- [ ] Tests créés (si logique critique)
- [ ] `pnpm lint` passe
- [ ] `pnpm type-check` passe
- [ ] `pnpm build` passe
- [ ] Documentation à jour
- [ ] Commit message conventionnel

---

## 🔄 Workflow continu

### 1. Development loop

```
Développement → Validation → Tests → Commit → Push → CI/CD → Deploy
     ↑                                                           ↓
     └─────────────────── Feedback ──────────────────────────────┘
```

### 2. Rôle de l'agent

- **Développement** : Génère le code conforme
- **Validation** : Vérifie automatiquement
- **Tests** : Crée et exécute les tests
- **Commit** : Messages conventionnels
- **CI/CD** : Surveille les builds
- **Feedback** : Analyse les erreurs et propose fixes

---

## 🚨 Limites de l'agent IA

### Ce que l'agent PEUT faire

✅ Générer du code boilerplate
✅ Appliquer des patterns connus
✅ Refactorer selon règles
✅ Détecter bugs évidents
✅ Créer tests unitaires
✅ Documenter le code

### Ce que l'agent NE PEUT PAS faire

❌ Prendre des décisions métier
❌ Comprendre le contexte utilisateur complet
❌ Anticiper tous les edge cases
❌ Remplacer la review humaine
❌ Garantir 0 bug

### Validation humaine requise

- ✋ Décisions d'architecture importantes
- ✋ Choix de stack technique
- ✋ Logique métier critique
- ✋ Sécurité sensible (paiements, auth)
- ✋ Déploiement en production

---

## 📚 Ressources pour l'agent

### Documentation à charger

1. **Quickstart** : Setup initial
2. **Architecture** : Patterns et structure
3. **Règles strictes** : Conventions obligatoires
4. **Configuration** : Setup outils
5. **Sécurité** : Best practices

### Contexte projet à fournir

```markdown
# Contexte Projet

**Type** : Application web full-stack
**Stack** : Next.js 15 + React 19 + TypeScript + Prisma
**Database** : PostgreSQL (Supabase)
**Auth** : NextAuth.js v5
**Deployment** : Vercel
**State** : TanStack Query + Zustand

**Objectifs** :
- Performance : Lighthouse > 90
- Sécurité : Headers + validation
- SEO : Metadata + sitemap
- DX : Type-safe end-to-end

**Contraintes** :
- TypeScript strict obligatoire
- Validation Zod systématique
- Tests pour logique critique
- Documentation code public
```

---

## 🎓 Entraînement de l'agent

### Exemples de code conforme

Fournir des exemples de code respectant les règles :

```typescript
// ✅ BON : Server Action avec validation Zod
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const createEventSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.date(),
})

export async function createEvent(formData: FormData) {
  try {
    const data = createEventSchema.parse({
      title: formData.get('title'),
      date: new Date(formData.get('date') as string),
    })

    const event = await prisma.event.create({ data })

    revalidatePath('/events')
    return { success: true, event }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data' }
    }
    console.error('Error creating event:', error)
    return { success: false, error: 'Server error' }
  }
}
```

---

## ✅ Résumé

L'agent IA est un **assistant puissant** mais :

1. **Doit suivre la documentation** strictement
2. **Applique les règles** sans exception
3. **Valide systématiquement** son code
4. **Documente** ses changements
5. **Demande validation humaine** pour décisions critiques

**L'agent accélère le développement, l'humain garde le contrôle.**
