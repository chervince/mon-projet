# 🔄 Workflows CI/CD

**Automatisation de la qualité et du déploiement**

---

## 🎯 Objectifs

Les workflows CI/CD permettent de :

- ✅ **Valider** automatiquement le code (lint, tests, build)
- ✅ **Déployer** automatiquement (preview + production)
- ✅ **Notifier** l'équipe des résultats
- ✅ **Bloquer** les PRs avec erreurs
- ✅ **Gagner du temps** et éviter les erreurs humaines

---

## 🛠️ GitHub Actions

### Workflow principal : CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint:check

      - name: Type check
        run: pnpm type-check

      - name: Format check
        run: pnpm format:check

      - name: Run tests
        run: pnpm test:coverage

      - name: Build
        run: pnpm build

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  security:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run security audit
        run: pnpm audit --audit-level moderate

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
```

### Workflow E2E

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, develop]

jobs:
  e2e:
    name: Playwright Tests
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps

      - name: Run Playwright tests
        run: pnpm test:e2e
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Workflow Deploy Preview

```yaml
# .github/workflows/preview.yml
name: Deploy Preview

on:
  pull_request:
    branches: [main, develop]

jobs:
  deploy-preview:
    name: Deploy to Vercel Preview
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Preview deployed: https://preview-url.vercel.app'
            })
```

---

## 🪝 Husky Hooks

### Pre-commit

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Lint staged files
pnpm lint-staged

# Type check
pnpm type-check

echo "✅ Pre-commit checks passed!"
```

### Pre-push

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."

# Run tests
pnpm test

echo "✅ Tests passed, pushing..."
```

### Commit-msg

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
pnpm commitlint --edit "$1"
```

### Configuration lint-staged

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

---

## 🚀 Déploiement Vercel

### Configuration vercel.json

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Protection de branches

Configuration GitHub :

1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern** : `main`
3. **Require pull request reviews** : ✅
4. **Require status checks to pass** : ✅
   - CI / quality
   - E2E / e2e
5. **Require conversation resolution** : ✅
6. **Do not allow bypassing** : ✅

---

## 📊 Badges de statut

Ajouter au README.md :

```markdown
# Mon Projet

![CI](https://github.com/user/repo/actions/workflows/ci.yml/badge.svg)
![E2E](https://github.com/user/repo/actions/workflows/e2e.yml/badge.svg)
[![codecov](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/user/repo)
```

---

## 🔔 Notifications

### Slack

```yaml
# Ajouter à la fin de ci.yml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ CI Failed on ${{ github.ref }}",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Build Failed*\nBranch: `${{ github.ref }}`\nCommit: ${{ github.sha }}"
            }
          }
        ]
      }
```

---

## ✅ Checklist Workflows

### Setup initial

- [ ] GitHub Actions configurés (ci.yml)
- [ ] Husky hooks installés
- [ ] lint-staged configuré
- [ ] Protection de branches activée
- [ ] Vercel lié au repo GitHub

### Par feature

- [ ] CI passe sur la branche
- [ ] Tests E2E passent
- [ ] Preview deployed
- [ ] Code review effectuée

---

**L'automatisation garantit la qualité constante du code**
