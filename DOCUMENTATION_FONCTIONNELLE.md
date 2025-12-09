# 📖 Documentation Fonctionnelle - GSB Gestion de Frais

> Guide utilisateur de l'application GSB  
> Version 1.0.0 - Décembre 2025

---

## 📚 Navigation Documentation

| Document | Description |
|----------|-------------|
| [🏠 README](./README.md) | Vue d'ensemble du projet |
| [📘 Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) | Architecture et API |
| **📗 Documentation Fonctionnelle** | **Vous êtes ici** |
| [🚀 Guide d'Installation](./GUIDE_INSTALLATION.md) | Installation pas à pas |
| [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) | Référentiel BTS |

---

## 📋 Table des matières

1. [Présentation](#présentation)
2. [Public cible](#public-cible)
3. [Fonctionnalités](#fonctionnalités)
4. [Guide utilisateur](#guide-utilisateur)
5. [Guide administrateur](#guide-administrateur)
6. [FAQ](#faq)

---

## 🎯 Présentation

### Qu'est-ce que GSB ?

GSB (Galaxy Swiss Bourdin) est une application web moderne qui permet de gérer simplement les notes de frais professionnels. Elle remplace le processus papier traditionnel par une solution numérique intuitive.

### Objectifs

- ✅ Soumettre des notes de frais en quelques clics
- ✅ Suivre l'état de ses demandes en temps réel
- ✅ Accélérer les validations et remboursements
- ✅ Centraliser tous les justificatifs
- ✅ Obtenir des statistiques détaillées

### Avantages

| Pour les employés | Pour les managers |
|-------------------|-------------------|
| Soumission rapide depuis mobile/PC | Validation centralisée |
| Suivi en temps réel | Tableau de bord statistique |
| Plus de papier perdu | Traçabilité complète |
| Notifications automatiques | Export des données |

---

## 👥 Public cible

### Employés (rôle "user")

Tout salarié de GSB amené à engager des frais professionnels :
- Commerciaux
- Managers
- Techniciens en déplacement
- Équipes support

### Administrateurs (rôle "admin")

Gestionnaires RH et comptables responsables de :
- Valider/rejeter les demandes
- Gérer les utilisateurs
- Consulter les statistiques
- Exporter les données

---

## ⚙️ Fonctionnalités

### 🔐 Authentification

#### Connexion locale
- Email + mot de passe
- Compte sécurisé par hash SHA-256

#### Connexion Google (SSO)
- Un clic pour se connecter
- Pas de mot de passe à retenir
- Synchronisation automatique

### 📝 Gestion des notes de frais

#### Création
- Formulaire simple et intuitif
- Upload de justificatif (photo, PDF)
- Types de frais prédéfinis :
  - 🍽️ Repas
  - 🚗 Transport
  - 🏨 Hébergement
  - 📱 Téléphone
  - 🎫 Autres

#### Suivi
- **Pending** : En attente de validation
- **Approved** : Validée et remboursée
- **Rejected** : Refusée avec motif

#### Historique
- Toutes les notes de frais archivées
- Recherche par date, montant, statut
- Téléchargement des justificatifs

### 👤 Profil utilisateur

- Modification des informations personnelles
- Changement de mot de passe
- Statistiques personnelles

### 📊 Dashboard (Admin)

- Vue d'ensemble des demandes
- Graphiques statistiques
- Montants totaux par période
- Validation en masse

### 👥 Gestion des utilisateurs (Admin)

- Création de comptes
- Modification des rôles
- Désactivation de comptes
- Export de la liste

---

## 📱 Guide utilisateur

### 1. Première connexion

#### Avec un compte existant

1. Aller sur l'application : `https://gsb-app.vercel.app`
2. Cliquer sur **"Se connecter"**
3. Saisir votre email et mot de passe
4. Cliquer sur **"Connexion"**

#### Avec Google

1. Cliquer sur **"Se connecter avec Google"**
2. Choisir votre compte Google
3. Autoriser l'application GSB
4. Vous êtes connecté !

#### Créer un compte

1. Cliquer sur **"Créer un compte"**
2. Remplir le formulaire :
   - Nom complet
   - Email professionnel
   - Mot de passe (min. 8 caractères)
3. Cliquer sur **"S'inscrire"**
4. Vous recevez un email de confirmation

---

### 2. Soumettre une note de frais

#### Étape 1 : Accéder au formulaire

- Cliquer sur **"Nouvelle demande"** dans le menu
- Ou sur le bouton **"+"** en bas à droite

#### Étape 2 : Remplir les informations

```
┌─────────────────────────────────────┐
│  📝 Nouvelle note de frais          │
├─────────────────────────────────────┤
│  Date *                             │
│  [09/12/2025]                       │
│                                     │
│  Type de frais *                    │
│  [▼ Repas                    ]      │
│                                     │
│  Montant (€) *                      │
│  [45.50]                            │
│                                     │
│  Description *                      │
│  [Repas client - Restaurant...]     │
│                                     │
│  Justificatif * (image/PDF)         │
│  [📎 Ajouter un fichier]            │
│                                     │
│  [Annuler]  [Soumettre]             │
└─────────────────────────────────────┘
```

#### Étape 3 : Ajouter le justificatif

- Cliquer sur **"Ajouter un fichier"**
- Depuis votre ordinateur : sélectionner l'image/PDF
- Depuis votre mobile : Prendre une photo ou choisir dans la galerie
- Formats acceptés : JPG, PNG, PDF
- Taille max : 5 MB

#### Étape 4 : Valider

- Vérifier les informations
- Cliquer sur **"Soumettre"**
- Une notification confirme l'envoi
- La demande apparaît dans "Mes demandes" avec le statut **Pending**

---

### 3. Suivre ses demandes

#### Accéder à l'historique

- Menu **"Mes demandes"**
- Liste de toutes vos notes de frais

#### Comprendre les statuts

| Statut | Icône | Signification |
|--------|-------|---------------|
| **Pending** | 🟡 | En attente de validation |
| **Approved** | ✅ | Validée - Remboursement en cours |
| **Rejected** | ❌ | Refusée - Voir le motif |

#### Détails d'une demande

Cliquer sur une ligne pour voir :
- Toutes les informations saisies
- Le justificatif en grand
- L'historique des actions
- Le commentaire du validateur (si rejet)

---

### 4. Consulter ses statistiques

#### Dashboard personnel

Menu **"Dashboard"** affiche :

```
┌──────────────────────────────────────────┐
│  📊 Mes statistiques                     │
├──────────────────────────────────────────┤
│  Demandes en cours        3              │
│  Total validé ce mois     450,00 €       │
│  Total de l'année         5 240,00 €     │
├──────────────────────────────────────────┤
│  📈 Graphique par type                   │
│  [Graphique en barres]                   │
├──────────────────────────────────────────┤
│  📆 Évolution mensuelle                  │
│  [Courbe de tendance]                    │
└──────────────────────────────────────────┘
```

---

### 5. Gérer son profil

#### Modifier ses informations

1. Menu **"Profil"**
2. Cliquer sur **"Modifier"**
3. Changer :
   - Nom
   - Email
   - Photo de profil
4. Enregistrer

#### Changer son mot de passe

1. Menu **"Paramètres"**
2. Section **"Sécurité"**
3. Saisir :
   - Ancien mot de passe
   - Nouveau mot de passe
   - Confirmation
4. Cliquer sur **"Mettre à jour"**

---

## 👨‍💼 Guide administrateur

### 1. Dashboard admin

#### Vue d'ensemble

```
┌──────────────────────────────────────────────┐
│  🏢 Administration GSB                       │
├──────────────────────────────────────────────┤
│  📊 Statistiques globales                    │
│  ┌────────────┬────────────┬────────────┐   │
│  │ En attente │  Validées  │  Refusées  │   │
│  │     12     │     45     │      3     │   │
│  └────────────┴────────────┴────────────┘   │
├──────────────────────────────────────────────┤
│  💰 Montants                                 │
│  Ce mois : 12 450,00 €                       │
│  Cette année : 98 340,00 €                   │
├──────────────────────────────────────────────┤
│  👥 Utilisateurs actifs : 42                 │
└──────────────────────────────────────────────┘
```

### 2. Valider les demandes

#### Accéder aux demandes

- Menu **"Demandes en attente"**
- Liste de toutes les notes à valider

#### Processus de validation

1. **Consulter** : Cliquer sur une demande
2. **Vérifier** :
   - Montant cohérent
   - Justificatif valide
   - Description claire
   - Respect de la politique de frais
3. **Décider** :
   - ✅ **Approuver** : Valider le remboursement
   - ❌ **Rejeter** : Refuser avec motif
   - 💬 **Demander des infos** : Commentaire à l'utilisateur

#### Validation rapide

- Cocher plusieurs demandes
- Cliquer sur **"Valider la sélection"**
- Toutes les demandes cochées sont approuvées

---

### 3. Gérer les utilisateurs

#### Liste des utilisateurs

Menu **"Utilisateurs"** :

```
┌─────────────────────────────────────────────────────┐
│  Nom             Email              Rôle    Actions │
├─────────────────────────────────────────────────────┤
│  Alice Martin    alice@gsb.fr      User    [⚙️ ❌]  │
│  Bob Dupont      bob@gsb.fr        Admin   [⚙️ ❌]  │
│  Claire Dubois   claire@gsb.fr     User    [⚙️ ❌]  │
└─────────────────────────────────────────────────────┘
```

#### Créer un utilisateur

1. Cliquer sur **"+ Nouvel utilisateur"**
2. Remplir :
   - Nom complet
   - Email
   - Rôle (User / Admin)
   - Mot de passe temporaire
3. Cliquer sur **"Créer"**
4. L'utilisateur reçoit un email avec ses identifiants

#### Modifier un utilisateur

1. Cliquer sur l'icône **⚙️**
2. Modifier :
   - Nom
   - Email
   - Rôle
3. Enregistrer

#### Supprimer un utilisateur

1. Cliquer sur l'icône **❌**
2. Confirmer la suppression
3. ⚠️ **Attention** : Toutes les factures de l'utilisateur sont conservées

---

### 4. Exporter les données

#### Export Excel/CSV

1. Menu **"Rapports"**
2. Choisir la période :
   - Ce mois
   - Ce trimestre
   - Cette année
   - Personnalisée
3. Sélectionner le format :
   - 📊 Excel (.xlsx)
   - 📄 CSV (.csv)
   - 📑 PDF (.pdf)
4. Cliquer sur **"Télécharger"**

#### Contenu de l'export

Colonnes incluses :
- Date de la dépense
- Employé (nom, email)
- Type de frais
- Montant
- Statut
- Date de validation
- Validateur

---

## ❓ FAQ

### Questions générales

#### Puis-je utiliser l'application sur mobile ?

✅ Oui ! L'application est **responsive** et fonctionne parfaitement sur :
- 📱 Smartphone (iOS, Android)
- 💻 Ordinateur (Windows, Mac, Linux)
- 📱 Tablette

#### Mes données sont-elles sécurisées ?

✅ Absolument :
- 🔒 Connexion HTTPS chiffrée
- 🔐 Mots de passe hashés (SHA-256)
- 🛡️ Authentification JWT
- ☁️ Hébergement sécurisé (AWS, MongoDB Atlas)
- 🔑 Accès contrôlé par rôles

#### Quels types de fichiers puis-je uploader ?

Formats acceptés :
- Images : JPG, PNG
- Documents : PDF
- Taille max : **5 MB**

---

### Utilisation

#### J'ai oublié mon mot de passe, que faire ?

1. Cliquer sur **"Mot de passe oublié ?"** sur la page de connexion
2. Saisir votre email
3. Vous recevez un lien de réinitialisation
4. Cliquer sur le lien et choisir un nouveau mot de passe

#### Puis-je modifier une note de frais après l'avoir soumise ?

❌ Non, une fois soumise, la note de frais ne peut plus être modifiée.

**Solution** :
- Annuler la demande actuelle
- Créer une nouvelle demande avec les bonnes informations

#### Combien de temps pour être remboursé ?

⏱️ Délais moyens :
1. Validation : **1-3 jours ouvrés**
2. Traitement comptable : **5-7 jours ouvrés**
3. Virement bancaire : **2-3 jours**

**Total** : Environ 10-15 jours ouvrés

#### Je ne retrouve plus mon justificatif, que faire ?

📎 Tous vos justificatifs sont sauvegardés dans l'application :
1. Menu **"Mes demandes"**
2. Cliquer sur la demande concernée
3. Le justificatif est affiché en grand
4. Possibilité de le télécharger (icône 💾)

---

### Problèmes techniques

#### L'application ne charge pas

Vérifier :
1. 📶 Connexion internet active
2. 🌐 Navigateur à jour (Chrome, Firefox, Safari, Edge)
3. 🔄 Vider le cache du navigateur
4. 🚫 Désactiver temporairement les extensions (AdBlock...)

#### Je ne peux pas uploader mon justificatif

Causes possibles :
- ❌ Fichier trop volumineux (> 5 MB)
- ❌ Format non supporté (utiliser JPG, PNG ou PDF)
- ❌ Connexion internet lente

**Solution** :
- Compresser l'image (utiliser TinyPNG, Compressor.io)
- Convertir en PDF si nécessaire

#### Mon token a expiré

🔒 Les sessions expirent après **24 heures** pour des raisons de sécurité.

**Solution** :
- Se reconnecter
- Cocher "Se souvenir de moi" pour rester connecté plus longtemps

---

### Administration

#### Comment promouvoir un utilisateur en admin ?

1. Menu **"Utilisateurs"**
2. Cliquer sur **⚙️** à côté de l'utilisateur
3. Changer le rôle : `User` → `Admin`
4. Enregistrer

#### Puis-je annuler une validation ?

✅ Oui, en tant qu'admin :
1. Accéder à la demande validée
2. Cliquer sur **"Annuler la validation"**
3. Le statut repasse à **Pending**

#### Comment supprimer une facture ?

1. Menu **"Toutes les demandes"**
2. Cliquer sur la demande à supprimer
3. Bouton **"Supprimer"** (icône 🗑️)
4. Confirmer

⚠️ **Attention** : La suppression est **irréversible** !

---

## 📞 Support

### Besoin d'aide ?

#### Documentation du projet

- [🏠 README](./README.md) - Démarrage rapide
- [📘 Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) - Pour les développeurs
- [🚀 Guide d'Installation](./GUIDE_INSTALLATION.md) - Installation et résolution de problèmes
- [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) - Pour comprendre le projet (étudiants)

#### Problèmes d'installation ?

Consultez le [Guide de résolution de problèmes](./GUIDE_INSTALLATION.md#résolution-de-problèmes) qui couvre :
- Erreurs MongoDB
- Problèmes de connexion
- Erreurs d'upload S3
- OAuth Google

#### Contact

📧 **Email** : support@gsb.fr  
📞 **Téléphone** : 01 23 45 67 89 (Lundi-Vendredi : 9h-18h)  
🐛 **Signaler un bug** : https://github.com/gsb/issues

---

## 📝 Annexes

### Politique de frais GSB

#### Frais de repas

| Situation | Montant max |
|-----------|-------------|
| Repas seul | 25 € |
| Repas avec client | 80 € |
| Petit-déjeuner | 15 € |

#### Frais de transport

| Mode | Remboursement |
|------|---------------|
| Véhicule personnel | 0,35 €/km |
| Train | Billet 2e classe |
| Avion | Classe éco uniquement |
| Taxi | Sur justificatif (max 50 €) |

#### Frais d'hébergement

| Ville | Montant max/nuit |
|-------|------------------|
| Paris | 180 € |
| Province | 120 € |
| Étranger | 200 € |

---

### Raccourcis clavier

| Action | Raccourci |
|--------|-----------|
| Nouvelle demande | `Ctrl + N` |
| Rechercher | `Ctrl + F` |
| Profil | `Ctrl + P` |
| Déconnexion | `Ctrl + Q` |
| Aide | `F1` |

---

### Glossaire

| Terme | Définition |
|-------|------------|
| **JWT** | JSON Web Token - Jeton d'authentification |
| **CRUD** | Create, Read, Update, Delete |
| **SSO** | Single Sign-On - Authentification unique |
| **Dashboard** | Tableau de bord |
| **Upload** | Téléverser, envoyer un fichier |
| **Statut pending** | En attente de validation |

---

**📅 Dernière mise à jour** : Décembre 2025  
**📖 Version** : 1.0.0  
**🏢 Entreprise** : GSB - Galaxy Swiss Bourdin

---

*Guide utilisateur réalisé dans le cadre du BTS SIO option SLAM*

