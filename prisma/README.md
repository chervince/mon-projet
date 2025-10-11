# Prisma Database Schema

Ce dossier contient la configuration Prisma pour la base de données PostgreSQL (Supabase).

## Structure

```
prisma/
├── schema.prisma              # Schéma de la base de données (source de vérité)
├── migrations/                # Migrations actives
│   ├── 20251012090741_baseline/  # Migration baseline (état actuel complet)
│   └── migration_lock.toml
└── archived_migrations/       # Anciennes migrations (référence historique)
    └── 20251009034649_init/      # Migration initiale obsolète
```

## Migration Baseline

La migration `20251012090741_baseline` représente l'**état complet et actuel** de la base de données Supabase.

Elle contient tous les modèles:

- **User**: Utilisateurs avec authentification (role: user/admin)
- **Account, Session, VerificationToken**: Tables NextAuth v5
- **Merchant**: Commerçants partenaires avec paramètres de fidélité
- **Credit**: Crédits XPF accumulés par utilisateur/marchand
- **Voucher**: Bons d'achat générés automatiquement
- **ScanLog**: Historique des scans de tickets

## Reconstruire la base de données

Pour créer une nouvelle base de données identique à Supabase:

```bash
# Appliquer toutes les migrations
npx prisma migrate deploy

# Ou pour le développement (avec prompt)
npx prisma migrate dev
```

## Commandes utiles

```bash
# Vérifier l'état de synchronisation
npx prisma migrate status

# Générer le client Prisma (après modification du schema)
npx prisma generate

# Ouvrir l'interface graphique
npx prisma studio

# Voir les différences entre schema et DB
npx prisma migrate diff \
  --from-schema-datamodel ./schema.prisma \
  --to-schema-datasource ./schema.prisma \
  --script
```

## Notes importantes

- ⚠️ **Ne jamais** utiliser `prisma migrate reset` en production
- ✅ Le schéma `schema.prisma` est la **source de vérité**
- ✅ La base Supabase est **toujours à jour** avec ce schéma
- 📦 `binaryTargets` inclut `rhel-openssl-3.0.x` pour Vercel

## Historique

L'ancienne migration `20251009034649_init` contenait un schéma obsolète (establishments, transactions) et a été remplacée par la baseline actuelle le 12 octobre 2025.
