# TODO - Développement Application de Fidélisation Neith Consulting

Basé sur le brief dans `details_application.md`, voici toutes les étapes nécessaires pour aboutir à une application fonctionnelle.

## 📋 Vue d'ensemble

**Objectif** : Application PWA de fidélisation avec crédits XPF par marchand, déclenchement automatique de bons d'achat.

**Priorités** : Sécurité > Fonctionnalité > Performance > UX

---

## 🔐 Phase 1 : Authentification et Base de Données (1-2 semaines)

### 1.1 Configuration Authentification

- [x] Configurer NextAuth.js avec credentials (email/mot de passe)
- [x] Créer middleware pour protection des routes admin (/admin/_) et user (/dashboard/_)
- [x] Implémenter JWT pour sessions utilisateurs et admin
- [x] Ajouter boutons de logout dans Dashboard et Admin
- [x] Configuration Supabase Auth pour gestion users
- [ ] Google OAuth (si nécessaire)
- [ ] Ajouter validation Zod pour formulaires login/signup

### 1.2 Schéma Base de Données (Prisma)

- [x] Modèle `User` : id, email, name, password (hash), role, createdAt
- [x] Modèle `Account` : NextAuth accounts table
- [x] Modèle `Session` : NextAuth sessions table
- [x] Modèle `VerificationToken` : NextAuth verification tokens
- [x] Modèle `Merchant` (Establishment) : id, name, logo, address, creditPercentage, threshold, validityMonths, merchantCode, qrCode, createdAt
- [x] Modèle `Credit` : id, userId, merchantId, amount, expiresAt, createdAt
- [x] Modèle `Voucher` : id, userId, merchantId, amount, qrCode, merchantCode, isUsed, usedAt, createdAt
- [x] Modèle `ScanLog` : id, userId, merchantId, ticketAmount, creditsEarned, timestamp, ip
- [x] Relations complètes entre tous les modèles
- [x] Migrations Prisma appliquées avec succès
- [x] Configuration binary targets pour Vercel (rhel-openssl-3.0.x)

### 1.3 Seed de Données

- [x] Scripts admin pour création compte admin (admin:create-supabase)
- [x] Scripts de gestion passwords (admin:reset-password, admin:reset-password-prod)
- [x] Scripts de debug (admin:debug-login, admin:check-config, admin:list-users)
- [ ] Données de test : 2-3 marchands fictifs avec QR codes
- [ ] Utilisateurs de test avec crédits et bons

---

## 🏪 Phase 2 : Dashboard Admin (1 semaine)

### 2.1 Interface Admin

- [x] Page login admin sécurisée (/admin/login)
- [x] Dashboard principal (/admin) avec navigation
- [x] Layout responsive
- [x] Bouton logout
- [ ] Amélioration navigation (Marchands, Monitoring, Logs)

### 2.2 Gestion Marchands

- [x] Page dashboard admin (/admin)
- [x] Formulaire création marchand :
  - [x] Nom, adresse
  - [x] % crédits (1-20%, défaut 10%)
  - [x] Seuil trigger (≥500 XPF, défaut 2000 XPF)
  - [x] Validité crédits (≥3 mois, défaut 6 mois)
  - [x] Code marchand (4 caractères unique, génération auto)
  - [ ] Upload logo (stockage local/cloud)
  - [ ] Mots-clés OCR pour reconnaissance
- [x] Affichage liste marchands
- [x] Génération QR onboarding par marchand
- [ ] Édition/Suppression marchands
- [ ] Validation unicité code marchand côté serveur

### 2.3 Monitoring Global

- [x] Vue d'ensemble : Total utilisateurs, marchands, crédits distribués, bons générés/consommés
- [x] Activité récente (scans)
- [ ] Liste détaillée utilisateurs (nom, email, soldes par marchand)
- [ ] Liste détaillée marchands (stats crédits/bons)
- [ ] Logs scans et validations (avec filtres date/marchand)
- [ ] Export CSV pour analyses

---

## 📱 Phase 3 : Interface Utilisateur - Base (1 semaine)

### 3.1 Onboarding et Installation PWA

- [ ] Page accueil (/) avec QR scan onboarding (redirection depuis QR marchand)
- [ ] Popup installation PWA (service worker, manifest.json)
- [x] Formulaire inscription/connexion (email/mot de passe)
- [ ] Splash screen avec logo marchand au scan QR

### 3.2 Structure Dashboard Utilisateur

- [x] Layout avec bottom navigation : Accueil, Partenaires, Mes Bons
- [x] Protection routes utilisateur (middleware)
- [x] Design responsive, épuré
- [x] Bouton logout
- [ ] Améliorer accessibilité

### 3.3 Page Accueil

- [x] Palmarès top 3 soldes (logos marchands, noms, montants XPF)
- [x] Bouton principal "Scanner un ticket"
- [x] Statistiques: nombre de partenaires, total crédits
- [ ] Notifications push (permissions au premier login)
- [ ] Données réelles depuis API

---

## 📷 Phase 4 : Scan de Tickets et OCR (2 semaines)

### 4.1 Intégration Caméra

- [ ] Bouton scan → Accès caméra PWA
- [ ] Interface scan avec overlay (cadre pour ticket)
- [ ] Gestion permissions caméra

### 4.2 OCR et Traitement

- [ ] Intégration API OCR (Google Vision API ou alternative)
- [ ] Extraction montant (regex pour formats XPF : "10 000 XPF", "10000F")
- [ ] Identification marchand (mots-clés configurables par marchand)
- [ ] Validation : montant >0, marchand reconnu

### 4.3 Attribution Crédits

- [ ] Calcul crédits : montant × % marchand
- [ ] Création enregistrement Credit (avec date expiration)
- [ ] Mise à jour solde utilisateur/marchand
- [ ] Animation visuelle "+XXX XPF chez [Marchand] ! Solde : XXX XPF"
- [ ] Stockage offline si pas de réseau (sync différé)

### 4.4 Anti-Fraude

- [ ] Limite scans/jour par utilisateur (5-10 max)
- [ ] Logs détaillés (timestamp, IP, image hash)
- [ ] Validation serveur avant attribution crédits

---

## 🎯 Phase 5 : Système de Bons d'Achat (1 semaine)

### 5.1 Génération Automatique

- [ ] Vérification post-scan : si solde ≥ seuil marchand
- [ ] Création Voucher : valeur = seuil, QR unique, code marchand
- [ ] Reset solde à 0
- [ ] Push notification : "Nouveau bon XXX XPF chez [Marchand] !"

### 5.2 Interface "Mes Bons"

- [ ] Liste bons actifs (QR, code sous QR, valeur, date création)
- [ ] QR scannable (grand, centré)
- [ ] Champ input + bouton "Valider" pour saisie manuelle
- [ ] Bons expirés grisées, non-cliquables

### 5.3 Validation en Caisse

- [ ] Endpoint API pour validation QR/code
- [ ] Vérification : bon existe, non utilisé, pas expiré
- [ ] Marquage utilisé (isUsed=true, usedAt=timestamp)
- [ ] Réponse : succès/remise à appliquer
- [ ] Logs validation (pour monitoring)

---

## ⏰ Phase 6 : Expiration et Notifications (1 semaine)

### 6.1 Système d'Expiration

- [ ] Job cron (ou vérification périodique) pour crédits expirés
- [ ] Suppression crédits expirés (ou marquage inactif)
- [ ] Calcul dates : createdAt + validityMonths

### 6.2 Notifications Push

- [ ] Intégration Web Push API (service worker)
- [ ] Templates :
  - Nouveau bon : "Nouveau bon XXX XPF chez [Marchand] !"
  - Expiration J-20 : "Tes XXX XPF expirent dans 20 jours - dépense-les !"
  - Expiration J-1 : "Tes XXX XPF expirent demain !"
- [ ] Gestion abonnements push par utilisateur

### 6.3 Interface Notifications

- [ ] Historique notifications dans app
- [ ] Clic notif → redirection vers page concernée

---

## 🏪 Phase 7 : Page Partenaires (0.5 semaine)

### 7.1 Liste Partenaires

- [ ] Page scrollable avec cartes marchands (logo, nom, solde utilisateur)
- [ ] Tri par solde décroissant
- [ ] Recherche/filtrage

### 7.2 Détail Marchand

- [ ] Clic carte → page détail (adresse, description, historique utilisateur)
- [ ] Bouton "Scanner chez ce marchand"
- [ ] Stats personnelles : crédits actuels, bons générés

---

## 🔒 Phase 8 : Sécurité et Robustesse (1 semaine)

### 8.1 Sécurité Générale

- [x] Hash mots de passe (bcrypt)
- [x] Protection routes avec NextAuth
- [ ] Headers sécurité (CSP, HSTS, XSS protection)
- [ ] Rate limiting sur APIs sensibles (scan, validation)
- [ ] Validation input côté serveur (Zod schemas)

### 8.2 Anti-Fraude Avancé

- [ ] Vérification IP géolocalisation (NC uniquement ?)
- [ ] Limite temporelle entre scans (éviter spam)
- [ ] Audit logs complets (modifications admin, actions sensibles)

### 8.3 Gestion Erreurs

- [ ] Pages erreurs 404/500
- [ ] Gestion réseau offline (retry automatique)
- [ ] Messages erreurs utilisateur-friendly

---

## 📱 Phase 9 : PWA et Offline (1 semaine)

### 9.1 Configuration PWA

- [ ] Service Worker pour cache (pages, assets)
- [ ] Manifest.json complet (icônes, couleurs NC)
- [ ] Splash screen et thème

### 9.2 Fonctionnalités Offline

- [ ] Stockage local scans en attente
- [ ] Sync automatique à reconnexion
- [ ] Indicateur réseau dans UI
- [ ] Cache bons pour consultation hors ligne

### 9.3 Performance

- [ ] Optimisation images (logos marchands)
- [ ] Lazy loading composants
- [ ] Bundle splitting

---

## 🧪 Phase 10 : Tests et Validation (1 semaine)

### 10.1 Tests Unitaires

- [x] Setup Vitest avec coverage thresholds (80%)
- [ ] Fonctions utilitaires (calcul crédits, validation QR)
- [ ] Composants React (scan, bons, formulaires)
- [ ] Hooks custom (auth, notifications)

### 10.2 Tests d'Intégration

- [ ] Flows complets : scan → crédits → bon → validation
- [ ] APIs (auth, scan, validation)
- [ ] Base de données (relations, contraintes)

### 10.3 Tests E2E

- [ ] Parcours utilisateur complet (Playwright)
- [ ] Admin : création marchand → scan user → validation
- [ ] Tests mobile (responsive, PWA)

### 10.4 Tests OCR

- [ ] Tickets variés (qualité, formats)
- [ ] Edge cases (montants étranges, marchands inconnus)

---

## 🚀 Phase 11 : Déploiement et Monitoring (0.5 semaine)

### 11.1 Configuration Production

- [x] Variables environnement Supabase/Vercel
- [x] Build optimisation (Next.js)
- [x] Prisma configuration pour Vercel
- [x] Déploiement automatique via GitHub
- [ ] CDN pour assets statiques

### 11.2 Monitoring

- [ ] Logs erreurs (Sentry ou Vercel monitoring)
- [ ] Analytics performance (Vercel Analytics)
- [ ] Métriques métier (crédits distribués, taux utilisation)

### 11.3 Documentation Finale

- [x] CLAUDE.md : Architecture et patterns
- [x] README.md : Getting started
- [ ] Guide utilisateur (comment scanner, utiliser bons)
- [ ] Guide marchand (comment imprimer QR)

---

## 📊 Estimation Totale

- **Durée estimée** : 10-12 semaines pour équipe de 2-3 devs
- **Priorité développement** : Phases 1-5 en premier (MVP fonctionnel)
- **Dépendances externes** : API OCR (coût à évaluer)
- **Risques** : Précision OCR, performance offline, sécurité anti-fraude

---

## ✅ Critères de Succès

- [x] Admin peut se connecter et gérer marchands
- [x] Application déployée sur Vercel avec Prisma fonctionnel
- [ ] Utilisateur peut s'inscrire, scanner ticket, recevoir crédits
- [ ] Bon généré automatiquement au seuil
- [ ] Validation bon en caisse (QR ou code)
- [ ] App fonctionne offline
- [ ] Tests passent (80%+ couverture)
- [ ] Performance acceptable (Core Web Vitals)

---

## 🔄 Maintenance Continue

- [ ] Monitoring erreurs en prod
- [ ] Mises à jour sécurité
- [ ] Support utilisateurs (feedback)
- [ ] Évolution features (analytics-driven)
