# Configuration Google Cloud Platform

Ce fichier documente toutes les API Google nécessaires pour l'application de fidélisation Neith Consulting et les étapes de configuration.

## 📋 Vue d'ensemble des API nécessaires

### API Essentielles (Obligatoires)

1. **Google OAuth 2.0** - Authentification utilisateurs
2. **Google Cloud Vision API** - OCR des tickets de caisse
3. **Google Cloud Storage** (optionnel) - Stockage des images de tickets

### API Recommandées (Optionnelles mais utiles)

4. **Google Cloud Translation API** - Si tickets multilingues (français/anglais NC)
5. **Google Maps Platform API** - Géolocalisation des marchands (future feature)
6. **Firebase Cloud Messaging (FCM)** - Push notifications (alternative à Web Push API)

---

## 🚀 Configuration Google Cloud Console

### Étape 1: Créer un projet Google Cloud

1. **Aller sur Google Cloud Console**
   - URL: https://console.cloud.google.com
   - Se connecter avec votre compte Google

2. **Créer un nouveau projet**
   - Cliquer sur le sélecteur de projet (en haut à gauche, à côté de "Google Cloud")
   - Cliquer sur **"NOUVEAU PROJET"**
   - **Nom du projet**: `neith-fidelisation-nc` (ou votre choix)
   - **Organisation**: Laisser vide ou sélectionner si vous en avez une
   - **Emplacement**: Laisser par défaut
   - Cliquer sur **"CRÉER"**

3. **Sélectionner le projet créé**
   - Attendre quelques secondes (notification en haut à droite)
   - Sélectionner le projet dans le sélecteur

---

### Étape 2: Configurer la facturation (Obligatoire pour Vision API)

⚠️ **IMPORTANT**: La plupart des API Google nécessitent un compte de facturation, même si vous restez dans les quotas gratuits.

1. **Activer la facturation**
   - Menu ☰ → **"Facturation"**
   - Cliquer sur **"Associer un compte de facturation"**
   - Suivre les étapes pour ajouter une carte bancaire

2. **Quotas gratuits (à connaître):**
   - **Vision API**: 1 000 requêtes/mois gratuit
   - **OAuth 2.0**: Gratuit illimité
   - **Cloud Storage**: 5 GB gratuit
   - **Translation API**: Pas de quota gratuit (payant dès la 1ère requête)

3. **Configurer des alertes de budget** (Recommandé)
   - Menu Facturation → **"Budgets et alertes"**
   - Créer un budget: 50 EUR/mois
   - Alerte à 50%, 75%, 90%, 100%

---

### Étape 3: Activer les API nécessaires

#### 3.1 Google OAuth 2.0 (Authentification)

1. **Activer l'API**
   - Menu ☰ → **"API et services"** → **"Bibliothèque"**
   - Rechercher: `Google+ API` ou `Google People API`
   - Cliquer sur **"ACTIVER"**

2. **Créer des identifiants OAuth 2.0**
   - Menu ☰ → **"API et services"** → **"Identifiants"**
   - Cliquer sur **"+ CRÉER DES IDENTIFIANTS"** → **"ID client OAuth"**

3. **Configurer l'écran de consentement OAuth** (si demandé)
   - Type d'utilisateur: **"Externe"** (pour utilisateurs publics)
   - Cliquer **"Créer"**

   **Informations sur l'application:**
   - Nom de l'application: `Neith Fidélisation`
   - E-mail d'assistance utilisateur: `votre-email@example.com`
   - Logo de l'application: (optionnel)
   - Domaine de l'application: `mon-projet-mu.vercel.app`
   - Domaines autorisés: `vercel.app`
   - E-mail du développeur: `votre-email@example.com`
   - Cliquer **"ENREGISTRER ET CONTINUER"**

   **Champs d'application (Scopes):**
   - Ajouter: `.../auth/userinfo.email`
   - Ajouter: `.../auth/userinfo.profile`
   - Cliquer **"ENREGISTRER ET CONTINUER"**

   **Utilisateurs test** (mode développement):
   - Ajouter vos emails de test
   - Cliquer **"ENREGISTRER ET CONTINUER"**

   **Résumé:**
   - Vérifier et cliquer **"RETOUR AU TABLEAU DE BORD"**

4. **Créer l'ID client OAuth**
   - Retourner dans **"Identifiants"** → **"+ CRÉER DES IDENTIFIANTS"** → **"ID client OAuth"**
   - Type d'application: **"Application Web"**
   - Nom: `Neith App Web`

   **Origines JavaScript autorisées:**

   ```
   http://localhost:3000
   https://mon-projet-mu.vercel.app
   ```

   **URI de redirection autorisés:**

   ```
   http://localhost:3000/api/auth/callback/google
   https://mon-projet-mu.vercel.app/api/auth/callback/google
   ```

   - Cliquer **"CRÉER"**

5. **Récupérer les identifiants**
   - Copier **"ID client"** → Variable `GOOGLE_CLIENT_ID`
   - Copier **"Secret du client"** → Variable `GOOGLE_CLIENT_SECRET`
   - Cliquer **"OK"**

---

#### 3.2 Google Cloud Vision API (OCR des tickets)

1. **Activer l'API**
   - Menu ☰ → **"API et services"** → **"Bibliothèque"**
   - Rechercher: `Cloud Vision API`
   - Cliquer sur **"Cloud Vision API"**
   - Cliquer sur **"ACTIVER"**

2. **Créer une clé API** (Simple, recommandé pour commencer)
   - Menu ☰ → **"API et services"** → **"Identifiants"**
   - Cliquer sur **"+ CRÉER DES IDENTIFIANTS"** → **"Clé API"**
   - Copier la clé générée → Variable `GOOGLE_CLOUD_VISION_API_KEY`
   - Cliquer sur **"Modifier la clé API"** (pour sécuriser)

3. **Restreindre la clé API** (Sécurité)
   - **Restrictions liées à l'application:**
     - Sélectionner **"Sites Web (avec référents HTTP)"**
     - Ajouter les référents:
       ```
       http://localhost:3000/*
       https://mon-projet-mu.vercel.app/*
       ```

   - **Restrictions liées aux API:**
     - Sélectionner **"Limiter la clé aux API sélectionnées"**
     - Cocher: **"Cloud Vision API"**

   - Cliquer **"ENREGISTRER"**

4. **Alternative: Compte de service** (Production recommandée)

   Pour plus de sécurité en production, créer un compte de service:
   - Menu ☰ → **"IAM et administration"** → **"Comptes de service"**
   - Cliquer **"+ CRÉER UN COMPTE DE SERVICE"**
   - Nom: `vision-api-service`
   - Description: `Service account for Vision API OCR`
   - Cliquer **"CRÉER ET CONTINUER"**
   - Rôle: **"Utilisateur Vision API"** (Cloud Vision > Utilisateur Vision API)
   - Cliquer **"CONTINUER"** puis **"OK"**

   **Créer une clé JSON:**
   - Cliquer sur le compte de service créé
   - Onglet **"CLÉS"** → **"AJOUTER UNE CLÉ"** → **"Créer une clé"**
   - Format: **JSON**
   - Cliquer **"CRÉER"**
   - Le fichier JSON est téléchargé → À stocker en sécurité
   - **⚠️ NE JAMAIS committer ce fichier dans Git**

   Pour l'utiliser dans Vercel:
   - Copier tout le contenu du JSON
   - Variable d'environnement: `GOOGLE_CLOUD_VISION_CREDENTIALS` (en JSON stringifié)

---

#### 3.3 Google Cloud Storage (Optionnel - Stockage des tickets)

Si vous voulez stocker les images des tickets scannés:

1. **Activer l'API**
   - Menu ☰ → **"API et services"** → **"Bibliothèque"**
   - Rechercher: `Cloud Storage API`
   - Cliquer **"ACTIVER"**

2. **Créer un bucket**
   - Menu ☰ → **"Cloud Storage"** → **"Buckets"**
   - Cliquer **"CRÉER"**
   - Nom: `neith-fidelisation-tickets` (doit être unique globalement)
   - Région: `asia-southeast1` (Singapour, plus proche de NC)
   - Classe de stockage: **"Standard"**
   - Contrôle d'accès: **"Précis"**
   - Protection: Désactiver "Empêcher la suppression accidentelle" (dev)
   - Cliquer **"CRÉER"**

3. **Configurer les permissions**
   - Cliquer sur le bucket créé
   - Onglet **"AUTORISATIONS"**
   - Ajouter le compte de service créé précédemment
   - Rôle: **"Administrateur des objets Storage"**

---

#### 3.4 Firebase Cloud Messaging (Optionnel - Push Notifications)

Alternative moderne à Web Push API:

1. **Aller sur Firebase Console**
   - URL: https://console.firebase.google.com
   - Cliquer **"Ajouter un projet"**
   - Sélectionner votre projet Google Cloud existant: `neith-fidelisation-nc`
   - Accepter les conditions → **"Continuer"**
   - Google Analytics: **Activer** (recommandé)
   - Compte Analytics: Créer nouveau ou sélectionner existant
   - Cliquer **"Ajouter Firebase"**

2. **Ajouter une application Web**
   - Dans le projet Firebase, cliquer sur l'icône **Web** `</>`
   - Nom de l'application: `Neith Fidélisation Web`
   - Cocher **"Configurer aussi Firebase Hosting"** (optionnel)
   - Cliquer **"Enregistrer l'application"**

3. **Récupérer la configuration**
   - Copier l'objet `firebaseConfig`
   - Variables à ajouter dans `.env.local`:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=xxx
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
     NEXT_PUBLIC_FIREBASE_APP_ID=xxx
     ```

4. **Activer Cloud Messaging**
   - Menu Firebase → **"Messagerie Cloud"**
   - Cliquer **"Premiers pas"**
   - Suivre l'assistant

5. **Générer une paire de clés VAPID**
   - Paramètres projet (⚙️) → **"Messagerie Cloud"**
   - Onglet **"Web Push certificates"**
   - Cliquer **"Générer une nouvelle paire de clés"**
   - Copier la clé → Variable `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

---

#### 3.5 Google Maps Platform API (Optionnel - Géolocalisation)

Pour afficher les marchands sur une carte (future feature):

1. **Activer les API**
   - Menu ☰ → **"API et services"** → **"Bibliothèque"**
   - Rechercher et activer:
     - `Maps JavaScript API`
     - `Geocoding API`
     - `Places API` (recherche d'adresses)

2. **Créer une clé API**
   - Identifiants → **"+ CRÉER DES IDENTIFIANTS"** → **"Clé API"**
   - Copier la clé → Variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

3. **Restreindre la clé**
   - Restrictions liées à l'application: **"Sites Web"**
   - Ajouter les référents (localhost + production)
   - Restrictions liées aux API: Cocher les 3 API Maps
   - **ENREGISTRER**

---

#### 3.6 Google Cloud Translation API (Optionnel - Multilingue)

Si vous voulez traduire automatiquement les tickets français ↔ anglais:

⚠️ **Attention**: Cette API est **payante dès la 1ère requête** (~20$/million de caractères)

1. **Activer l'API**
   - Menu ☰ → **"API et services"** → **"Bibliothèque"**
   - Rechercher: `Cloud Translation API`
   - Cliquer **"ACTIVER"**

2. **Utiliser la clé API ou compte de service**
   - Utiliser la même clé que Vision API (si non restreinte)
   - Ou créer une clé spécifique

---

## 📝 Variables d'environnement finales

Ajoutez ces variables dans votre `.env.local` et sur **Vercel**:

### Essentielles (À configurer maintenant)

```env
# Google OAuth 2.0
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Google Cloud Vision API (Clé API - Simple)
GOOGLE_CLOUD_VISION_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# OU Google Cloud Vision API (Compte de service - Production)
GOOGLE_CLOUD_VISION_CREDENTIALS='{"type":"service_account","project_id":"xxx",...}'
```

### Optionnelles (Pour plus tard)

```env
# Google Cloud Storage
GOOGLE_CLOUD_STORAGE_BUCKET=neith-fidelisation-tickets

# Firebase Cloud Messaging
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_VAPID_KEY=xxx

# Google Maps Platform
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 💰 Estimation des coûts (pour planifier)

### Quotas gratuits mensuels

| API                     | Quota gratuit  | Prix au-delà             |
| ----------------------- | -------------- | ------------------------ |
| **Vision API (OCR)**    | 1 000 requêtes | $1.50 / 1000 requêtes    |
| **OAuth 2.0**           | Illimité       | Gratuit                  |
| **Cloud Storage**       | 5 GB           | $0.02 / GB / mois        |
| **Translation API**     | 0 (payant)     | $20 / million caractères |
| **Maps JavaScript API** | $200 de crédit | Variable selon usage     |
| **FCM**                 | Illimité       | Gratuit                  |

### Exemple de coût mensuel estimé

Pour **1 000 utilisateurs** avec **10 scans/mois chacun** = 10 000 scans/mois

- Vision API: 10 000 requêtes
  - 1 000 gratuits = **9 000 payants**
  - Coût: 9 × $1.50 = **$13.50**

- Cloud Storage: 10 000 images × 500 KB = **5 GB**
  - Quota gratuit = **$0**

- **Total estimé: ~$15/mois** pour 1 000 utilisateurs actifs

---

## 🔒 Sécurité et bonnes pratiques

### ✅ À FAIRE

1. **Restreindre toutes les clés API**
   - Limiter aux domaines autorisés
   - Limiter aux API spécifiques
   - Surveiller l'utilisation dans Cloud Console

2. **Utiliser des comptes de service en production**
   - Plus sécurisé que les clés API
   - Permissions granulaires
   - Rotation facile des clés

3. **Ne JAMAIS committer les secrets**
   - Ajouter `.env.local` dans `.gitignore` ✅
   - Utiliser les variables d'environnement Vercel
   - Utiliser des secrets GitHub Actions si CI/CD

4. **Configurer des alertes de facturation**
   - Budget mensuel
   - Notifications par email à 50%, 75%, 90%

5. **Monitorer l'usage des API**
   - Google Cloud Console → API et services → Tableau de bord
   - Vérifier les quotas et pics d'utilisation

### ❌ À NE PAS FAIRE

- ❌ Ne jamais exposer les clés API côté client (sauf NEXT*PUBLIC*)
- ❌ Ne pas utiliser de clés API non restreintes
- ❌ Ne pas oublier de supprimer les ressources de test
- ❌ Ne pas négliger les alertes de facturation

---

## 🧪 Tester les API

### Test Vision API (OCR)

```bash
# Test avec curl (remplacer YOUR_API_KEY)
curl -X POST \
  "https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [{
      "image": {
        "source": {
          "imageUri": "https://example.com/ticket.jpg"
        }
      },
      "features": [{
        "type": "TEXT_DETECTION"
      }]
    }]
  }'
```

### Test OAuth (dans l'app)

```typescript
// src/app/auth/signin/page.tsx
import { signIn } from "next-auth/react"

<button onClick={() => signIn("google")}>
  Se connecter avec Google
</button>
```

---

## 📚 Documentation officielle

- **Google Cloud Console**: https://console.cloud.google.com
- **Vision API Docs**: https://cloud.google.com/vision/docs
- **OAuth 2.0**: https://developers.google.com/identity/protocols/oauth2
- **Cloud Storage**: https://cloud.google.com/storage/docs
- **Firebase Console**: https://console.firebase.google.com
- **Maps Platform**: https://developers.google.com/maps

---

## 🚀 Prochaines étapes

1. ✅ **Maintenant**: Configurer OAuth 2.0 (pour authentification Google)
2. ✅ **Phase 4**: Configurer Vision API (pour OCR tickets)
3. ⏳ **Phase 6**: Configurer FCM (pour push notifications)
4. ⏳ **Future**: Maps API (géolocalisation marchands)

---

## 🆘 Troubleshooting courant

### "API key not valid"

→ Vérifier que l'API est activée dans la bibliothèque
→ Vérifier les restrictions de la clé (domaines, API)

### "Quota exceeded"

→ Vérifier l'utilisation dans Cloud Console
→ Augmenter le budget ou optimiser les appels

### "Unauthorized" avec compte de service

→ Vérifier que le compte de service a les bonnes permissions
→ Vérifier que le JSON credentials est correct dans les variables d'env

### OAuth redirect_uri_mismatch

→ Vérifier que l'URI de callback est exactement celle configurée
→ Respecter http vs https, avec/sans trailing slash

---

**Dernière mise à jour**: 12 octobre 2025
**Maintenu par**: Neith Consulting - Vincent
