# 🌿 Règles Git et Workflow

**Workflow Git obligatoire pour tous les contributeurs**

---

## 🎯 Vue d'ensemble

Workflow basé sur **Git Flow simplifié** avec 3 branches principales :

```
main (production)
  ↑
develop (staging/test)
  ↑
feature/nom (développement)
```

---

## 🌳 Structure des branches

### 1. `main` - Production

- **Rôle** : Code en production
- **Protection** : Commits directs interdits
- **Merge** : Uniquement depuis `develop` via PR
- **Déploiement** : Automatique sur Vercel production
- **Règle** : Ne contient que du code testé et validé

```bash
# ❌ INTERDIT
git checkout main
git commit -m "fix"
git push

# ✅ OBLIGATOIRE
# Passer par une PR depuis develop
```

### 2. `develop` - Staging

- **Rôle** : Intégration et tests avant production
- **Protection** : Commits directs découragés
- **Merge** : Depuis `feature/*` via PR
- **Déploiement** : Automatique sur Vercel preview
- **Règle** : Code fonctionnel mais en cours de validation

### 3. `feature/*` - Développement

- **Nommage** : `feature/description-courte`
- **Création** : Depuis `develop`
- **Durée de vie** : Courte (quelques jours max)
- **Suppression** : Après merge dans `develop`

**Exemples** :
```
feature/user-authentication
feature/blog-system
feature/payment-integration
feature/seo-optimization
```

---

## 🔄 Workflow de développement

### 1. Créer une nouvelle feature

```bash
# Mettre à jour develop
git checkout develop
git pull origin develop

# Créer la branche feature
git checkout -b feature/notifications

# Vérifier la branche actuelle
git branch
```

### 2. Développer

```bash
# Faire des modifications
# ...

# Stager les fichiers
git add .

# Commit (voir conventions ci-dessous)
git commit -m "feat: add notification system"

# Push vers GitHub
git push origin feature/notifications
```

### 3. Créer une Pull Request

```bash
# Via GitHub CLI
gh pr create \
  --title "Feature: Notifications" \
  --body "Ajout du système de notifications en temps réel" \
  --base develop \
  --head feature/notifications

# Ou via l'interface GitHub
```

### 4. Code Review

- **Obligatoire** : Au moins 1 reviewer
- **Checks** : CI/CD doit passer (lint, tests, build)
- **Changements** : Appliquer les retours de review

```bash
# Après retours de review
git add .
git commit -m "fix: address review comments"
git push origin feature/notifications
```

### 5. Merge

```bash
# Squash and merge (recommandé)
# Via GitHub interface ou CLI
gh pr merge --squash

# Supprimer la branche locale
git checkout develop
git pull origin develop
git branch -d feature/notifications
```

### 6. Release vers production

```bash
# Depuis develop, créer PR vers main
gh pr create \
  --title "Release v1.2.0" \
  --body "Release notes..." \
  --base main \
  --head develop

# Après merge, créer un tag
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

---

## 📝 Convention de Commits (Conventional Commits)

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types obligatoires

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat: add user login` |
| `fix` | Correction de bug | `fix: resolve login error` |
| `docs` | Documentation | `docs: update README` |
| `style` | Formatage (pas de logique) | `style: format with prettier` |
| `refactor` | Refactoring | `refactor: simplify auth logic` |
| `perf` | Optimisation performance | `perf: optimize image loading` |
| `test` | Ajout de tests | `test: add login tests` |
| `chore` | Tâches maintenance | `chore: update dependencies` |
| `ci` | CI/CD | `ci: add GitHub Actions` |

### Exemples

```bash
# Feature simple
git commit -m "feat: add dark mode toggle"

# Fix avec scope
git commit -m "fix(auth): resolve session timeout"

# Avec body explicatif
git commit -m "feat: implement blog system

- Add BlogPost model
- Create CRUD API routes
- Add admin interface
- Add public blog pages

Closes #42"

# Breaking change
git commit -m "feat!: migrate to Next.js 15

BREAKING CHANGE: Requires Node.js 20+
Migration guide in docs/migration.md"
```

### Règles de messages

**DO** ✅ :
- Utiliser l'impératif présent ("add" pas "added")
- Première ligne < 72 caractères
- Décrire le "quoi" et le "pourquoi", pas le "comment"
- Référencer les issues (#123)

**DON'T** ❌ :
- Messages vagues ("fix bug", "update code")
- Emojis dans le message (sauf si convention équipe)
- Plusieurs modifications non liées dans un commit

---

## 🚫 Interdictions strictes

### 1. Jamais de force push sur main/develop

```bash
# ❌ INTERDIT
git push --force origin main
git push --force origin develop

# ⚠️ Acceptable uniquement sur feature/* avec précaution
git push --force origin feature/ma-branche
```

### 2. Jamais commit de secrets

```bash
# ❌ INTERDIT dans le code
const API_KEY = "sk_live_abc123"
const DATABASE_URL = "postgresql://user:pass@..."

# ✅ Utiliser .env.local (dans .gitignore)
const API_KEY = process.env.API_KEY
```

### 3. Jamais commit de fichiers générés

```bash
# .gitignore OBLIGATOIRE
node_modules/
.next/
.env.local
*.log
.DS_Store
```

### 4. Pas de commits directs sur main

```bash
# ❌ INTERDIT
git checkout main
git commit -m "hotfix"

# ✅ Créer une branche même pour hotfix
git checkout -b hotfix/critical-bug
# ... fix ...
git commit -m "fix: critical security issue"
# Créer PR vers main
```

---

## 🎯 Pull Requests

### Template de PR

```markdown
## Description

Brève description de la PR (1-2 phrases)

## Type de changement

- [ ] Bug fix
- [ ] Nouvelle feature
- [ ] Breaking change
- [ ] Documentation

## Changements

- Ajout de X
- Modification de Y
- Suppression de Z

## Tests

- [ ] Tests unitaires ajoutés
- [ ] Tests E2E ajoutés
- [ ] Tests manuels effectués

## Screenshots (si UI)

[Insérer screenshots]

## Checklist

- [ ] Code respecte les conventions
- [ ] `pnpm lint` passe
- [ ] `pnpm type-check` passe
- [ ] `pnpm build` passe
- [ ] Documentation mise à jour
- [ ] Tests ajoutés
```

### Règles de PR

1. **Titre descriptif** : "Feature: Add blog system"
2. **Description claire** : Contexte, changements, impact
3. **Petites PRs** : < 400 lignes de code changées (idéalement)
4. **1 PR = 1 feature** : Pas de modifications non liées
5. **Commits atomiques** : Chaque commit compile et fonctionne
6. **Tests** : Ajouter tests pour nouvelle logique
7. **Review** : Au moins 1 approbation

---

## 🔍 Code Review

### Checklist du reviewer

- [ ] Code respecte les conventions
- [ ] Logique claire et compréhensible
- [ ] Pas de code dupliqué
- [ ] Error handling en place
- [ ] Tests présents et pertinents
- [ ] Performance acceptable
- [ ] Sécurité : pas de failles évidentes
- [ ] Documentation à jour

### Feedback constructif

**DO** ✅ :
```
"Suggestion: On pourrait simplifier cette fonction en utilisant
Promise.all pour paralléliser les requêtes. Qu'en penses-tu?"
```

**DON'T** ❌ :
```
"Ce code est nul, refais-le."
```

---

## 🆘 Situations d'urgence

### Hotfix critique en production

```bash
# 1. Créer branche hotfix depuis main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# 2. Fix + commit
git add .
git commit -m "fix: critical security vulnerability"

# 3. PR directement vers main
gh pr create --base main --title "HOTFIX: Security vulnerability"

# 4. Après merge, reporter le fix dans develop
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

---

## 📊 Historique propre

### Squash commits avant merge

```bash
# Squash des commits de la feature
git checkout feature/ma-feature
git rebase -i develop

# Dans l'éditeur, remplacer "pick" par "squash" pour les commits à fusionner
# Sauvegarder et éditer le message final
```

### Rebase plutôt que merge

```bash
# Mettre à jour la feature avec develop
git checkout feature/ma-feature
git rebase develop

# Résoudre les conflits si nécessaire
git add .
git rebase --continue

# Force push (OK sur feature branch)
git push --force origin feature/ma-feature
```

---

## ✅ Checklist Git

Avant chaque commit :

- [ ] Fichiers générés exclus (.gitignore)
- [ ] Pas de secrets dans le code
- [ ] Message de commit conventionnel
- [ ] Code compile et fonctionne
- [ ] Lint + type-check passent

Avant chaque PR :

- [ ] Branche à jour avec develop
- [ ] Tous les commits pertinents
- [ ] Description claire
- [ ] Tests ajoutés
- [ ] CI/CD passe

---

**Un historique Git propre = projet maintenable**
