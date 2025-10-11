Brief pour l'App de Fidélisation - Neith Consulting (Nouvelle-Calédonie)

Description du Projet

Neith Consulting, société spécialisée dans la digitalisation, développe une application PWA de fidélisation dédiée aux entreprises de Nouvelle-Calédonie. L'app propose un partenariat via abonnement (géré en dehors de l'application) : Neith crée un compte marchand paramétré pour chaque commerçant partenaire. Les Calédoniens sont invités à créer un compte sur l'URL de l'app. Une fois connectés, les utilisateurs scannent leurs tickets de caisse : l'OCR reconnaît le marchand (via mots-clés) et le montant, pour allouer des crédits (un pourcentage du montant, paramétré par marchand) stockés par utilisateur et par marchand. Ces crédits sont utilisables uniquement chez ce marchand, accumulés jusqu'à un seuil (paramétré) qui déclenche un bon d'achat automatique de valeur égale au seuil, avec remise à zéro du solde. Les bons sont à usage unique, validés en caisse via QR (scannable par téléphone ou douchette) ou saisie d'un code marchand (4 chiffres/lettres) sous le QR avec bouton valider. L'app est structurée en deux dashboards principaux : admin (création merchants, monitoring global) et users (scan central, menu bottom : partenaires, mes bons, accueil). Focus sur simplicité, offline et UX low-tech pour le contexte NC (connexions variables, petits commerces).

Flows Utilisateurs

Onboarding : L'utilisateur scanne un QR code en magasin (unique au marchand, avec logo affiché), redirigé vers l'URL PWA. Page d'accueil invite à se connecter/créer un compte (login/mot de passe ou Google). Popup informative pour installer la PWA sur le téléphone.

Scan Ticket : Bouton principal "Scanner un ticket" → OCR extrait montant et identifie marchand. Si valide, +crédits (ex. : 10% → 1000 XPF pour 10 000 XPF ticket). Affichage : "+1000 XPF chez Lulu’s ! Solde : 1500 XPF."

Trigger et Bon : À seuil atteint (ex. : 2000 XPF), bon généré auto, push notif, solde reset à 0. Onglet "Mes Bons" affiche QR/code.

Consommation : En caisse, montrer QR (scan téléphone/douchette) ou saisir code marchand (4 chiffres/lettres) sous QR + valider. Bon consommé, message "Remise 2000 XPF à appliquer". Grisé après usage.

Expiration : Crédits valides 6 mois (paramétré par marchand). Push J-20 et J-1 (24h) : "Tes crédits expirent bientôt ! Dépense-les."

Navigation : Accueil (palmarès top 3 soldes), Partenaires (liste logos/noms/soldes), Mes Bons (QR actifs).

Flow Admin

Connexion : Accès sécurisé au dashboard admin.

Création Marchand : Formulaire pour ajouter : nom, logo, adresse, % crédits (1-20%), seuil trigger (min 500 XPF), validité crédits (défaut 6 mois), code marchand (4 chiffres/lettres unique).

Monitoring : Vue globale : liste merchants/users, soldes crédits, bons générés/consommés, logs scans/validations. Accès détails comptes users/merchants.

Notes Générales

Changements Majeurs :

Crédits en XPF concrets (ex. : 10 000 XPF ticket → 1000 XPF à 10%), pas de points abstraits.

Admin only : Neith paramètre tout, pas d'accès marchand.

Bon = valeur seuil trigger, reset solde à 0.

Validité crédits paramétrable (défaut 6 mois), alertes push J-20/J-1.

UX Globale : Design épuré, inclusif (logos locaux), animations légères (pop-up +crédits). Bottom menu intuitif. Popup install PWA à l'accueil.

Sécurité : Bons usage unique (hash/validation serveur). Logs anti-fraude (timestamp, IP). Auth JWT admin/users.

Offline : Stockage local scans/bons, sync différé.

Contexte NC : OCR robuste pour tickets variés (froissés/manuels). Support 3G/vieux phones. QR imprimables pour magasins.

Features à Implémenter

Feature 1 : Création et Paramétrage des Marchands (Admin Only)

Description : L'admin configure chaque marchand via formulaire interne : nom, logo, adresse, % crédits sur ticket, seuil trigger (valeur bon égale), validité crédits (mois), code marchand (4 chiffres/lettres pour validation manuelle).

Conceptualisation : Formulaire simple avec upload logo, inputs numériques (% 1-20%, seuil ≥500 XPF, validité ≥3 mois). Génération auto QR onboarding. Sauvegarde règles pour scans futurs. Pas d'accès marchand.

Feature 2 : Acquisition de Crédits via Scan de Ticket

Description : Scan ticket → OCR identifie marchand (mots-clés) et montant → +crédits (% paramétré, ex. : 10% de 10 000 XPF = 1000 XPF) au solde utilisateur/marchand.

Conceptualisation : Bouton scan central, caméra PWA. Post-scan : confirmation visuelle +crédits, solde mis à jour. Anti-fraude : limite scans/jour. Offline : stocker image, sync net.

Feature 3 : Génération Automatique de Bons d'Achat (Trigger)

Description : À seuil crédits atteint, générer bon QR (valeur = seuil), informer par push, reset solde à 0.

Conceptualisation : Déclenchement auto post-scan. Onglet "Mes Bons" : QR clignotant, code sous-jacent, expiry visible. Push : "Nouveau bon 2000 XPF chez Lulu’s !"

Feature 4 : Validation et Consommation des Bons

Description : Validation via QR scan (téléphone/douchette) ou saisie code marchand (4 chiffres/lettres) sous QR + bouton valider. Usage unique, remise manuelle appliquée.

Conceptualisation : Dans "Mes Bons", QR principal + champ input code + bouton "Valider". Succès : bon grisé, message "Remise appliquée". Serveur marque consommé. Offline checksum pour QR.

Feature 5 : Expiration des Crédits et Notifications

Description : Crédits expirent après durée paramétrée (défaut 6 mois). Push J-20 et J-1 pour alerter.

Conceptualisation : Tracking dates par solde. Notifs cliquables vers "Mes Bons"/scan. Ton motivant : "Tes 1500 XPF expirent bientôt – dépense-les !"

Feature 6 : Interface Utilisateur – Palmarès et Partenaires

Description : Accueil : palmarès top 3 soldes (logos/noms/XPF). Onglet Partenaires : liste scrollable (logos, noms, soldes), détail au clic (adresse, historique).

Conceptualisation : Remplacer ancien "Mes Points" par palmarès engageant. Design rond/épuré, refresh auto post-scan. Animation pop-up +crédits.

Feature 7 : QR Code Marchand pour Onboarding

Description : QR unique par marchand (deep-link app), affiche logo au scan.

Conceptualisation : Génération auto à création marchand, imprimable PDF. Redirection : accueil avec logo splash, invite login/install PWA.
