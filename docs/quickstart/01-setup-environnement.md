# 🔧 Setup Environnement de Développement

**Guide détaillé pour préparer votre machine**

---

## 🎯 Objectif

Installer et configurer tous les outils nécessaires pour développer un projet Next.js moderne.

---

## 1. Node.js (Version 20+)

### Installation

**macOS** (avec Homebrew) :
```bash
brew install node@20
```

**Linux** :
```bash
# Via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows** :
- Télécharger depuis https://nodejs.org
- Installer la version LTS (20.x)

### Vérification

```bash
node --version  # Doit afficher v20.x.x ou supérieur
npm --version
```

---

## 2. pnpm (Gestionnaire de packages)

### Pourquoi pnpm ?

- **Plus rapide** que npm/yarn
- **Économise de l'espace disque** (symlinks)
- **Meilleure gestion** des dépendances

### Installation

```bash
# Installer globalement via npm
npm install -g pnpm

# Ou via Homebrew (macOS)
brew install pnpm

# Ou via script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Vérification

```bash
pnpm --version  # Doit afficher 8.x.x ou supérieur
```

### Configuration

```bash
# Configurer pnpm pour votre projet
pnpm config set store-dir ~/.pnpm-store
pnpm config set shamefully-hoist true
```

---

## 3. Git

### Installation

**macOS** :
```bash
brew install git
```

**Linux** :
```bash
sudo apt-get install git
```

**Windows** :
- Télécharger Git for Windows : https://git-scm.com/download/win

### Configuration initiale

```bash
# Votre identité
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"

# Éditeur par défaut (optionnel)
git config --global core.editor "code --wait"

# Alias utiles
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

### Vérification

```bash
git --version
git config --list
```

---

## 4. GitHub CLI (Optionnel mais recommandé)

### Installation

**macOS** :
```bash
brew install gh
```

**Linux** :
```bash
# Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**Windows** :
```bash
winget install --id GitHub.cli
```

### Authentification

```bash
gh auth login
# Suivre les instructions interactives
```

### Vérification

```bash
gh --version
gh auth status
```

---

## 5. Éditeur de code : VS Code

### Installation

Télécharger depuis : https://code.visualstudio.com

### Extensions essentielles

```bash
# Installer via CLI
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension Prisma.prisma
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
```

**Extensions recommandées** :
- **ESLint** : Lint JavaScript/TypeScript
- **Prettier** : Formatage automatique
- **Prisma** : Support Prisma schema
- **Tailwind CSS IntelliSense** : Autocomplétion Tailwind
- **TypeScript** : Support TypeScript avancé
- **GitLens** : Améliorations Git
- **Error Lens** : Affichage inline des erreurs

### Configuration VS Code

Créer `.vscode/settings.json` dans votre projet :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 6. Outils CLI supplémentaires

### tsx (Exécuter TypeScript directement)

```bash
pnpm add -g tsx
```

### Vercel CLI

```bash
pnpm add -g vercel
```

### Prisma CLI (sera installé en dev dependency)

Pas besoin d'installation globale, utiliser via `pnpm prisma`

---

## 7. Base de données PostgreSQL (Optionnel en local)

### Option A : Supabase (Recommandé pour démarrer)

- Créer un compte sur https://supabase.com
- Pas d'installation locale nécessaire
- PostgreSQL géré dans le cloud

### Option B : PostgreSQL local

**macOS** :
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux** :
```bash
sudo apt-get install postgresql-15
sudo systemctl start postgresql
```

**Windows** :
- Télécharger depuis https://www.postgresql.org/download/windows/

### Créer une base de données locale

```bash
# Créer une DB pour votre projet
createdb mon_projet_dev

# Connection string
# postgresql://username:password@localhost:5432/mon_projet_dev
```

---

## 8. Vérification complète

### Script de vérification

Créer un fichier `check-env.sh` :

```bash
#!/bin/bash

echo "🔍 Vérification de l'environnement..."
echo ""

# Node.js
echo "📦 Node.js"
node --version || echo "❌ Node.js non installé"
echo ""

# pnpm
echo "📦 pnpm"
pnpm --version || echo "❌ pnpm non installé"
echo ""

# Git
echo "🔧 Git"
git --version || echo "❌ Git non installé"
echo ""

# GitHub CLI
echo "🐙 GitHub CLI"
gh --version || echo "⚠️  GitHub CLI non installé (optionnel)"
echo ""

# VS Code
echo "💻 VS Code"
code --version || echo "⚠️  VS Code non installé (optionnel)"
echo ""

echo "✅ Vérification terminée"
```

Exécuter :
```bash
chmod +x check-env.sh
./check-env.sh
```

---

## ✅ Checklist finale

- [ ] Node.js 20+ installé et vérifié
- [ ] pnpm installé et configuré
- [ ] Git installé et configuré (user.name, user.email)
- [ ] GitHub CLI installé et authentifié (optionnel)
- [ ] VS Code installé avec extensions
- [ ] tsx installé globalement
- [ ] Vercel CLI installé
- [ ] PostgreSQL accessible (Supabase ou local)

---

## 🎉 Environnement prêt !

Vous pouvez maintenant passer à : [02-premier-deploiement.md](02-premier-deploiement.md)

---

## 🆘 Troubleshooting

### Problème : pnpm command not found

```bash
# Ajouter pnpm au PATH
export PATH="$HOME/.local/share/pnpm:$PATH"

# Ou réinstaller
npm install -g pnpm
```

### Problème : Node version trop ancienne

```bash
# Utiliser nvm pour gérer les versions Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Problème : Permissions denied (macOS/Linux)

```bash
# Ne jamais utiliser sudo avec npm/pnpm
# Corriger les permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.pnpm-store
```
