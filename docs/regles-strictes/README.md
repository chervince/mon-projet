# 📏 Règles Strictes du Projet

**Règles non-négociables à respecter absolument**

---

## ⚠️ Importance

Ces règles sont **OBLIGATOIRES** et doivent être :

- ✅ Respectées dans **100%** du code
- ✅ Vérifiées par la **CI/CD**
- ✅ Bloquantes en cas de non-respect
- ✅ Appliquées **dès le premier commit**

**Le non-respect de ces règles peut entraîner** :
- Échec du build
- Failles de sécurité
- Bugs en production
- Dette technique

---

## 📋 Liste des règles

### 1. [TypeScript Strict](conventions-code.md#typescript-strict)

- Mode `strict: true` obligatoire
- Zéro `any` non justifié
- Tous les types explicites pour les exports publics

### 2. [Sécurité](regles-securite.md)

- Jamais de secrets en dur dans le code
- Validation de toutes les entrées utilisateur
- Headers de sécurité configurés
- HTTPS obligatoire en production

### 3. [Git Workflow](regles-git.md)

- Convention de commits (Conventional Commits)
- Pas de commits directs sur `main`
- Pull Requests obligatoires
- Code review avant merge

### 4. [Gestion d'erreurs](gestion-erreurs.md)

- Try/catch pour toutes les opérations async
- Error boundaries React
- Logging structuré des erreurs
- Messages d'erreur utilisateur friendly

### 5. [Performance](performance-obligatoire.md)

- Budgets de performance définis
- Images optimisées (Next.js Image)
- Code splitting automatique
- Core Web Vitals > seuils définis

---

## 🔍 Validation automatique

### Pre-commit hooks

```bash
# .husky/pre-commit
pnpm lint          # ESLint
pnpm type-check    # TypeScript
pnpm format:check  # Prettier
```

### CI/CD checks

```yaml
# .github/workflows/ci.yml
- Lint (ESLint)
- Type check (tsc)
- Tests (Vitest)
- Build (next build)
- Security scan
```

### Pre-deploy checks

```bash
pnpm validate  # Script de validation custom
pnpm build     # Doit réussir
```

---

## 🚫 Interdictions absolues

### Code

- ❌ `any` sans commentaire justificatif
- ❌ `@ts-ignore` sans raison documentée
- ❌ `console.log` en production
- ❌ Code mort (unused imports/variables)
- ❌ Secrets en dur (API keys, passwords)

### Git

- ❌ Commits sur `main` sans PR
- ❌ Force push sur `main`
- ❌ Commits de fichiers `.env`
- ❌ Messages de commit non explicites

### Sécurité

- ❌ Validation côté client uniquement
- ❌ SQL brut sans paramétrage
- ❌ Stockage de passwords en clair
- ❌ CORS ouvert à tous (`*`)

---

## ✅ Obligations

### Code

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configurés
- ✅ Tests pour logique critique
- ✅ Documentation pour API publiques
- ✅ Types pour toutes les fonctions exportées

### Git

- ✅ Commits atomiques
- ✅ Messages de commit clairs
- ✅ Branches feature/* pour nouvelles fonctionnalités
- ✅ Code review avant merge

### Sécurité

- ✅ Validation avec Zod côté serveur
- ✅ Headers de sécurité (CSP, HSTS, etc.)
- ✅ Authentification pour routes protégées
- ✅ Rate limiting sur API

### Performance

- ✅ Images via `next/image`
- ✅ Fonts via `next/font`
- ✅ Lazy loading des composants lourds
- ✅ Budgets JS < 200KB (initial bundle)

---

## 📊 Métriques minimales

### Code Quality

- **TypeScript coverage** : 100%
- **ESLint errors** : 0
- **ESLint warnings** : < 10
- **Prettier violations** : 0

### Tests

- **Unit test coverage** : > 80% (fichiers critiques)
- **E2E tests** : Flows principaux couverts

### Performance

- **Lighthouse Performance** : > 90
- **Lighthouse Accessibility** : > 90
- **Lighthouse Best Practices** : > 90
- **Lighthouse SEO** : > 90

### Bundle Size

- **Initial JS** : < 200KB
- **Total JS** : < 500KB
- **CSS** : < 50KB
- **Images** : WebP/AVIF optimisées

---

## 🛡️ Enforcement

### En développement

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbo",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "type-check": "tsc --noEmit",
    "validate": "pnpm lint && pnpm type-check"
  }
}
```

### En CI/CD

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
      # Fail si une étape échoue
```

### En pre-deploy

```bash
# vercel.json
{
  "buildCommand": "pnpm validate && pnpm build"
}
```

---

## 🎯 Checklist par feature

Avant de merger une feature, vérifier :

- [ ] TypeScript strict respecté (0 erreur)
- [ ] ESLint passe (0 erreur, warnings justifiés)
- [ ] Prettier appliqué
- [ ] Tests ajoutés pour nouvelle logique
- [ ] Pas de secrets en dur
- [ ] Validation côté serveur
- [ ] Error handling en place
- [ ] Performance acceptable (Lighthouse)
- [ ] Messages de commit conformes
- [ ] Documentation à jour si API publique

---

## 📚 Ressources

- [conventions-code.md](conventions-code.md) - Standards de code
- [regles-git.md](regles-git.md) - Workflow Git
- [regles-securite.md](regles-securite.md) - Sécurité
- [gestion-erreurs.md](gestion-erreurs.md) - Error handling
- [performance-obligatoire.md](performance-obligatoire.md) - Performance

---

## 🆘 En cas de blocage

Si une règle stricte bloque légitimement votre travail :

1. **Documenter la raison** dans un commentaire
2. **Créer une issue** pour discussion
3. **Proposer une exception temporaire** avec plan de résolution
4. **Ne jamais bypasser sans approval**

**Exemple de justification** :

```typescript
// @ts-ignore - Library @types incomplets, issue #123 créée
// TODO: Retirer quand @types/library sera à jour
import { brokenType } from 'library'
```

---

**Ces règles sont la fondation d'un projet de qualité. Respectez-les dès le premier commit.**
