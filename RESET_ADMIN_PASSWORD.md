# 🔐 Réinitialisation du mot de passe admin

## Pour l'environnement LOCAL

```bash
# 1. Lister les utilisateurs
npm run admin:list-users

# 2. Réinitialiser le mot de passe
npm run admin:reset-password <email> <nouveau-mot-de-passe>

# Exemple:
npm run admin:reset-password admin@neith.nc Anouwali_555
```

## Pour l'environnement PRODUCTION (Vercel)

### Étape 1 : Ajouter la variable d'environnement dans Vercel

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez une nouvelle variable :
   - **Name**: `ADMIN_RESET_SECRET`
   - **Value**: Une clé secrète complexe (ex: `my-super-secret-key-2025`)
   - **Environment**: Production
5. Cliquez sur **Save**
6. **Redéployez** votre application (Deployments → ... → Redeploy)

### Étape 2 : Committez et poussez les changements

```bash
git add .
git commit -m "feat: Add production password reset endpoint"
git push origin main
```

Attendez que le déploiement soit terminé sur Vercel.

### Étape 3 : Réinitialisez le mot de passe

```bash
npm run admin:reset-password-prod
```

Vous devrez fournir :

- **URL de production** : `https://votre-app.vercel.app`
- **Email admin** : `admin@neith.nc`
- **Nouveau mot de passe** : `Anouwali_555`
- **Clé secrète** : La valeur de `ADMIN_RESET_SECRET` que vous avez définie

### Étape 4 : IMPORTANT - Supprimer la route après utilisation

Pour des raisons de sécurité, supprimez la route API temporaire :

```bash
rm src/app/api/admin/reset-password-prod/route.ts
git add .
git commit -m "chore: Remove temporary password reset endpoint"
git push origin main
```

## Alternative : Directement via la base de données

Si vous avez accès direct à votre base de données PostgreSQL en production :

1. Connectez-vous à votre base de données
2. Générez un hash bcrypt du nouveau mot de passe (utilisez un outil en ligne ou Node.js)
3. Exécutez :

```sql
UPDATE "User"
SET password = 'hash_bcrypt_ici', role = 'admin'
WHERE email = 'admin@neith.nc';
```

## Créer un nouvel admin

```bash
# Local
npm run admin:create "Nom Admin" "email@example.com" "MotDePasse123"

# Production
# Utilisez la même procédure que ci-dessus mais créez une route API pour la création
```
