# TODO - Développement Application de Fidélisation Neith Consulting

Basé sur le brief dans `details_application.md`, voici toutes les étapes nécessaires pour aboutir à une application fonctionnelle.

## 📋 Vue d'ensemble

**Objectif** : Application PWA de fidélisation avec crédits XPF par marchand, déclenchement automatique de bons d'achat.

**Priorités** : Sécurité > Fonctionnalité > Performance > UX

---

## 🔐 Phase 1 : Authentification et Base de Données (1-2 semaines)

### 1.1 Configuration Authentification
- [ ] Configurer NextAuth.js avec credentials (email/mot de passe) et Google OAuth
- [ ] Créer middleware pour protection des routes admin (/admin/*) et user (/dashboard/*)
- [ ] Implémenter JWT pour sessions utilisateurs et admin
- [ ] Ajouter validation Zod pour formulaires login/signup

### 1.2 Schéma Base de Données (Prisma)
- [ ] Modèle `User` : id, email, name, password (hash), googleId, createdAt
- [ ] Modèle `Merchant` : id, name, logo, address, creditPercentage, threshold, validityMonths, merchantCode, qrCode, createdAt
- [ ] Modèle `Credit` : id, userId, merchantId, amount, expiresAt, createdAt
- [ ] Modèle `Voucher` : id, userId, merchantId, amount, qrCode, merchantCode, isUsed, usedAt, createdAt
- [ ] Modèle `ScanLog` : id, userId, merchantId, ticketAmount, creditsEarned, timestamp, ip
- [ ] Relations et migrations Prisma

### 1.3 Seed de Données
- [ ] Créer compte admin par défaut (via script ou migration)
- [ ] Données de test : 2-3 marchands fictifs avec QR codes
- [ ] Utilisateurs de test avec crédits et bons

---

## 🏪 Phase 2 : Dashboard Admin (1 semaine)

### 2.1 Interface Admin
- [ ] Page login admin sécurisée (/admin/login)
- [ ] Dashboard principal (/admin) avec navigation (Marchands, Monitoring, Logs)
- [ ] Layout responsive avec sidebar

### 2.2 Gestion Marchands
- [ ] Page liste marchands (/admin/merchants)
- [ ] Formulaire création marchand :
  - Nom, adresse
  - Upload logo (stockage local/cloud)
  - % crédits (1-20%, défaut 10%)
  - Seuil trigger (≥500 XPF, défaut 2000 XPF)
  - Validité crédits (≥3 mois, défaut 6 mois)
  - Code marchand (4 caractères unique, génération auto)
- [ ] Génération QR onboarding par marchand
- [ ] Édition/Suppression marchands
- [ ] Validation unicité code marchand

### 2.3 Monitoring Global
- [ ] Vue d'ensemble : Total utilisateurs, marchands, crédits distribués, bons générés/consommés
- [ ] Liste détaillée utilisateurs (nom, email, soldes par marchand)
- [ ] Liste détaillée marchands (stats crédits/bons)
- [ ] Logs scans et validations (avec filtres date/marchand)
- [ ] Export CSV pour analyses

---

## 📱 Phase 3 : Interface Utilisateur - Base (1 semaine)

### 3.1 Onboarding et Installation PWA
- [ ] Page accueil (/ ) avec QR scan onboarding (redirection depuis QR marchand)
- [ ] Popup installation PWA (service worker, manifest.json)
- [ ] Formulaire inscription/connexion (email/mot de passe, Google)
- [ ] Splash screen avec logo marchand au scan QR

### 3.2 Structure Dashboard Utilisateur
- [ ] Layout avec bottom navigation : Accueil, Partenaires, Mes Bons
- [ ] Protection routes utilisateur (middleware)
- [ ] Design responsive, épuré, accessible

### 3.3 Page Accueil
- [ ] Palmarès top 3 soldes (logos marchands, noms, montants XPF)
- [ ] Bouton principal "Scanner un ticket"
- [ ] Notifications push (permissions au premier login)

---

## 📷 Phase 4 : Scan de Tickets et OCR (2 semaines)

### 4.1 Intégration Caméra
- [ ] Bouton scan → Accès caméra PWA
- [ ] Interface scan avec overlay (cadre pour ticket)
- [ ] Gestion permissions caméra

### 4.2 OCR et Traitement
- [ ] Intégration API OCR (Google Vision API ou alternative gratuite/open-source)
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
- [ ] Headers sécurité (CSP, HSTS, XSS protection)
- [ ] Rate limiting sur APIs sensibles (scan, validation)
- [ ] Validation input côté serveur (Zod schemas)
- [ ] Hash mots de passe (bcrypt)

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
- [ ] Variables environnement Supabase/Vercel
- [ ] Build optimisation (Next.js)
- [ ] CDN pour assets statiques

### 11.2 Monitoring
- [ ] Logs erreurs (Sentry)
- [ ] Analytics performance (Vercel Analytics)
- [ ] Métriques métier (crédits distribués, taux utilisation)

### 11.3 Documentation Finale
- [ ] Guide utilisateur (comment scanner, utiliser bons)
- [ ] Guide marchand (comment imprimer QR)
- [ ] Mise à jour docs/ avec spécifications fonctionnelles

---

## 📊 Estimation Totale

- **Durée estimée** : 10-12 semaines pour équipe de 2-3 devs
- **Priorité développement** : Phases 1-5 en premier (MVP fonctionnel)
- **Dépendances externes** : API OCR (coût à évaluer)
- **Risques** : Précision OCR, performance offline, sécurité anti-fraude

---

## ✅ Critères de Succès

- [ ] Utilisateur peut s'inscrire, scanner ticket, recevoir crédits
- [ ] Bon généré automatiquement au seuil
- [ ] Validation bon en caisse (QR ou code)
- [ ] Admin peut créer/paramétrer marchands
- [ ] App fonctionne offline
- [ ] Tests passent (80%+ couverture)
- [ ] Performance acceptable (Core Web Vitals)

---

## 🔄 Maintenance Continue

- [ ] Monitoring erreurs en prod
- [ ] Mises à jour sécurité
- [ ] Support utilisateurs (feedback)
- [ ] Évolution features (analytics-driven)