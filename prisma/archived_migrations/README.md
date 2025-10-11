# Archived Migrations

Ce dossier contient les anciennes migrations qui ont été remplacées par la migration baseline.

## 20251009034649_init

**Date**: 9 octobre 2025
**Statut**: Obsolète, remplacée par `20251012090741_baseline`

Cette migration initiale contenait l'ancienne structure avec:

- Table `establishments` (remplacée par `merchants`)
- Table `transactions` (remplacée par `credits`, `vouchers`, `scan_logs`)
- Table `users` sans le champ `role`

Elle est conservée ici pour référence historique uniquement.

## Migration Baseline Actuelle

La migration active est `20251012090741_baseline` qui représente l'état complet et à jour de la base de données Supabase.
