# 🚀 Guide d'installation complet - GSB

> Installation pas à pas de l'application GSB  
> Pour développeurs et jurys BTS SIO  
> Version 1.0.0 - Décembre 2025

---

## 📚 Navigation Documentation

| Document | Description |
|----------|-------------|
| [🏠 README](./README.md) | Vue d'ensemble du projet |
| [📘 Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) | Architecture et API |
| [📗 Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) | Guide utilisateur |
| **🚀 Guide d'Installation** | **Vous êtes ici** |
| [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) | Référentiel BTS |

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation locale (développement)](#installation-locale-développement)
3. [Configuration des services externes](#configuration-des-services-externes)
4. [Déploiement en production](#déploiement-en-production)
5. [Vérification et tests](#vérification-et-tests)
6. [Résolution de problèmes](#résolution-de-problèmes)

---

## ✅ Prérequis

### Logiciels requis

| Logiciel | Version minimale | Lien de téléchargement |
|----------|------------------|------------------------|
| **Node.js** | 18.0.0 | https://nodejs.org/ |
| **npm** | 9.0.0 | Inclus avec Node.js |
| **Git** | 2.0+ | https://git-scm.com/ |
| **VS Code** (recommandé) | Dernière | https://code.visualstudio.com/ |

### Vérifier les versions installées

```bash
# Vérifier Node.js
node --version
# Devrait afficher : v18.x.x ou supérieur

# Vérifier npm
npm --version
# Devrait afficher : 9.x.x ou supérieur

# Vérifier Git
git --version
# Devrait afficher : git version 2.x.x
```

### Comptes requis (gratuits)

- [ ] **MongoDB Atlas** : https://www.mongodb.com/cloud/atlas/register
- [ ] **AWS** (S3) : https://aws.amazon.com/free/
- [ ] **Google Cloud** (OAuth - optionnel) : https://console.cloud.google.com/
- [ ] **GitHub** : https://github.com/signup

---

## 💻 Installation locale (développement)

### Étape 1 : Cloner le projet

```bash
# Cloner depuis GitHub (remplacer par votre URL)
git clone https://github.com/votre-username/GSB-.git

# Aller dans le dossier
cd GSB-

# Vérifier la structure
ls -la
# Vous devez voir : back-end/, front-end/, README.md, etc.
```

---

### Étape 2 : Installation du backend

```bash
# Aller dans le dossier backend
cd back-end

# Installer les dépendances
npm install

# Attendre la fin de l'installation...
# Vous devez voir : "added XXX packages"
```

**Dépendances installées :**
- express : Framework web
- mongoose : ODM MongoDB
- jsonwebtoken : Authentification JWT
- multer : Upload de fichiers
- aws-sdk : Intégration S3
- passport : OAuth Google
- cors : Cross-origin
- dotenv : Variables d'environnement

---

### Étape 3 : Configuration backend (.env)

#### 3.1 Créer le fichier .env

```bash
# Dans le dossier back-end
touch .env

# Ouvrir avec un éditeur
code .env
# ou
nano .env
```

#### 3.2 Copier cette configuration

```env
# ====================================
# CONFIGURATION GSB BACKEND
# ====================================

# Base de données MongoDB Atlas
MONGO_URI=mongodb+srv://VOTRE_USERNAME:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/gsb?retryWrites=true&w=majority

# Sécurité - Générer des valeurs aléatoires !
SALT=GÉNERER_UNE_CHAINE_ALEATOIRE_32_CARACTERES
JWT_SECRET=GÉNERER_UNE_CHAINE_ALEATOIRE_64_CARACTERES
SESSION_SECRET=GÉNERER_UNE_CHAINE_ALEATOIRE_32_CARACTERES

# AWS S3 (après création du bucket)
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=gsb-bucket

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Serveur
PORT=5000
NODE_ENV=development
```

#### 3.3 Générer les secrets aléatoires

**Méthode 1 : Avec Node.js**
```bash
# Dans un terminal
node -e "console.log('SALT=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Méthode 2 : Avec un site (déconseillé pour la production)**
- https://randomkeygen.com/

**Copier les valeurs générées** dans votre fichier `.env`.

---

### Étape 4 : Installation du frontend

```bash
# Ouvrir un NOUVEAU terminal
# Depuis la racine du projet
cd front-end

# Installer les dépendances
npm install
```

**Dépendances installées :**
- react : Framework UI
- react-dom : Rendu React
- react-router-dom : Navigation
- vite : Build tool

---

### Étape 5 : Configuration frontend

#### 5.1 Créer le fichier de config API

```bash
# Dans front-end/src/api/
code src/api/config.js
```

```javascript
// front-end/src/api/config.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
```

#### 5.2 (Optionnel) Variables d'environnement frontend

```bash
# Dans front-end/
touch .env
```

```env
# URL de l'API backend
VITE_API_URL=http://localhost:5000
```

---

## ☁️ Configuration des services externes

### 1. MongoDB Atlas (Base de données)

#### 1.1 Créer un compte

1. Aller sur https://www.mongodb.com/cloud/atlas/register
2. S'inscrire avec votre email
3. Confirmer l'email

#### 1.2 Créer un cluster

1. **Choisir le plan** : "Shared" (gratuit)
2. **Provider** : AWS
3. **Region** : `eu-west-1` (Europe - Ireland)
4. **Nom du cluster** : `Cluster0` (par défaut)
5. Cliquer sur **"Create Cluster"**

⏱️ Attendre 3-5 minutes pour la création...

#### 1.3 Créer un utilisateur

1. **Security → Database Access**
2. Cliquer sur **"Add New Database User"**
3. Authentication : **Username and Password**
   - Username : `gsb_admin`
   - Password : Générer un mot de passe fort (copier-le !)
4. Database User Privileges : **Read and write to any database**
5. Cliquer sur **"Add User"**

#### 1.4 Autoriser l'accès réseau

1. **Security → Network Access**
2. Cliquer sur **"Add IP Address"**
3. Choisir **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Pour le développement uniquement !
   - En production : Ajouter uniquement l'IP du serveur
4. Cliquer sur **"Confirm"**

#### 1.5 Récupérer l'URI de connexion

1. **Deployment → Database**
2. Cliquer sur **"Connect"** (bouton de votre cluster)
3. Choisir **"Connect your application"**
4. Driver : **Node.js**, Version : **4.1 or later**
5. Copier l'URI :
   ```
   mongodb+srv://gsb_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Remplacer `<password>`** par le mot de passe de l'utilisateur
7. **Ajouter le nom de la base** : `/gsb` après `.net`
   ```
   mongodb+srv://gsb_admin:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/gsb?retryWrites=true&w=majority
   ```
8. **Copier cette URI** dans `back-end/.env` → `MONGO_URI=...`

---

### 2. AWS S3 (Stockage des justificatifs)

#### 2.1 Créer un compte AWS

1. Aller sur https://aws.amazon.com/free/
2. Cliquer sur **"Créer un compte AWS"**
3. Suivre les étapes (carte bancaire requise, mais pas de débit si Free Tier)

#### 2.2 Créer un bucket S3

1. Aller sur **AWS Console** : https://console.aws.amazon.com/
2. Rechercher **"S3"** dans la barre de recherche
3. Cliquer sur **"Créer un compartiment"** (Create bucket)
4. **Configuration** :
   - Nom du compartiment : `gsb-bucket-votre-nom` (unique mondialement)
   - Région : `EU (Ireland) eu-west-1`
   - **Décocher** "Bloquer tout accès public" (pour afficher les justificatifs)
   - ⚠️ Cocher "Je comprends que ces paramètres..."
5. Cliquer sur **"Créer un compartiment"**

#### 2.3 Configurer les permissions

1. Cliquer sur votre bucket
2. Onglet **"Autorisations"** (Permissions)
3. **Stratégie de compartiment** (Bucket policy) → Modifier
4. Coller cette politique :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gsb-bucket-votre-nom/bills/*"
    }
  ]
}
```

**Remplacer `gsb-bucket-votre-nom`** par le nom réel de votre bucket.

5. Enregistrer

#### 2.4 Créer des clés d'accès IAM

1. Rechercher **"IAM"** dans la barre de recherche
2. Menu **"Utilisateurs"** → **"Créer un utilisateur"**
3. Nom : `gsb-s3-user`
4. **Étape permissions** : Attacher directement les stratégies
5. Rechercher et cocher : **`AmazonS3FullAccess`**
6. Créer l'utilisateur

7. Cliquer sur l'utilisateur créé
8. Onglet **"Informations d'identification de sécurité"**
9. **Clés d'accès** → **"Créer une clé d'accès"**
10. Cas d'utilisation : **"Application s'exécutant en dehors d'AWS"**
11. Confirmer et créer

12. **COPIER IMMÉDIATEMENT** :
    - **Access Key ID** : `AKIAXXXXXXXXXXXXXXXX`
    - **Secret Access Key** : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
    
    ⚠️ **Important** : Le secret ne sera plus jamais affiché !

13. Ajouter dans `back-end/.env` :
    ```env
    AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
    AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    AWS_REGION=eu-west-1
    AWS_BUCKET_NAME=gsb-bucket-votre-nom
    ```

---

### 3. Google OAuth (Optionnel)

#### 3.1 Créer un projet Google Cloud

1. Aller sur https://console.cloud.google.com/
2. Créer un nouveau projet : **"GSB Application"**
3. Attendre la création (30 secondes)

#### 3.2 Activer l'API Google+

1. Menu **"API et services"** → **"Bibliothèque"**
2. Rechercher **"Google+ API"**
3. Cliquer et **"Activer"**

#### 3.3 Configurer l'écran de consentement

1. **"API et services"** → **"Écran de consentement OAuth"**
2. Type : **"Externe"** → Créer
3. **Informations sur l'application** :
   - Nom : `GSB - Gestion de Frais`
   - Email d'assistance : votre email
4. **Champs d'application** : Ajouter
   - `userinfo.email`
   - `userinfo.profile`
5. Enregistrer

#### 3.4 Créer des identifiants OAuth

1. **"Identifiants"** → **"Créer des identifiants"** → **"ID client OAuth"**
2. Type : **"Application Web"**
3. Nom : `GSB Backend`
4. **URI de redirection autorisés** :
   - `http://localhost:5000/auth/google/callback` (dev)
   - `https://votre-api.onrender.com/auth/google/callback` (prod)
5. Créer

6. **Copier** :
   - **ID client** : `xxxxx.apps.googleusercontent.com`
   - **Secret du client** : `GOCSPX-xxxxxxxxxxxxxxxxx`

7. Ajouter dans `back-end/.env` :
   ```env
   GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   ```

---

## 🚀 Lancement de l'application

### Démarrer le backend

```bash
# Terminal 1 - Dans back-end/
npm run dev

# Vous devez voir :
# ✅ MongoDB connecté
# 🚀 Serveur lancé sur http://localhost:5000
```

**Vérifier le backend** :
```bash
# Dans un autre terminal
curl http://localhost:5000/

# Devrait retourner quelque chose (même un message d'erreur, c'est normal)
```

### Démarrer le frontend

```bash
# Terminal 2 - Dans front-end/
npm run dev

# Vous devez voir :
#   VITE v6.3.5  ready in XXX ms
#
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose
```

### Accéder à l'application

1. Ouvrir un navigateur
2. Aller sur **http://localhost:5173**
3. Vous devez voir la page de connexion GSB 🎉

---

## 🧪 Vérification et tests

### Test 1 : Créer un compte

1. Page de connexion → **"Créer un compte"**
2. Remplir :
   - Nom : `Test User`
   - Email : `test@example.com`
   - Password : `password123`
   - Rôle : `user`
3. Cliquer sur **"S'inscrire"**
4. ✅ **Succès** : Redirection vers le dashboard

### Test 2 : Se connecter

1. Se déconnecter
2. Page de connexion :
   - Email : `test@example.com`
   - Password : `password123`
3. Cliquer sur **"Connexion"**
4. ✅ **Succès** : Accès au dashboard

### Test 3 : Créer une note de frais

1. Cliquer sur **"Nouvelle demande"**
2. Remplir :
   - Date : Date du jour
   - Type : Repas
   - Montant : `45.50`
   - Description : `Repas client test`
   - Justificatif : Choisir une image (< 5MB)
3. Soumettre
4. ✅ **Succès** : La facture apparaît dans la liste avec statut "Pending"

### Test 4 : Vérifier le stockage S3

1. Aller sur **AWS S3 Console**
2. Ouvrir votre bucket
3. Dossier `bills/`
4. ✅ Vous devez voir votre justificatif uploadé

### Test 5 : Vérifier MongoDB

1. Aller sur **MongoDB Atlas**
2. **Database → Browse Collections**
3. Database : `gsb`
4. Collections :
   - `users` : Votre utilisateur test
   - `bills` : Votre facture test
5. ✅ Les données sont présentes

---

## 🐛 Résolution de problèmes

### Backend ne démarre pas

#### Erreur : "MONGO_URI is not defined"

**Cause** : Fichier `.env` mal configuré

**Solution** :
```bash
# Vérifier que le fichier existe
ls -la back-end/.env

# Vérifier le contenu
cat back-end/.env | grep MONGO_URI

# Doit afficher : MONGO_URI=mongodb+srv://...
```

---

#### Erreur : "MongoServerError: bad auth"

**Cause** : Mot de passe MongoDB incorrect

**Solution** :
1. Retourner sur MongoDB Atlas
2. **Database Access** → Modifier l'utilisateur
3. **Edit Password** → Générer un nouveau mot de passe
4. Copier le nouveau mot de passe
5. Mettre à jour `MONGO_URI` dans `.env`
6. Redémarrer le backend

---

#### Erreur : "Network timeout" MongoDB

**Cause** : IP non autorisée

**Solution** :
1. MongoDB Atlas → **Network Access**
2. Vérifier que `0.0.0.0/0` est dans la liste
3. Sinon : **Add IP Address** → **Allow Access from Anywhere**

---

### Frontend ne charge pas

#### Erreur : "Failed to fetch" sur les requêtes

**Cause** : Backend non démarré ou mauvaise URL

**Solution** :
```javascript
// Vérifier front-end/src/api/config.js
console.log(API_URL);  // Doit afficher : http://localhost:5000

// Vérifier que le backend est lancé
curl http://localhost:5000/
```

---

#### Page blanche après npm run dev

**Cause** : Erreur JavaScript

**Solution** :
```bash
# Ouvrir la console navigateur (F12)
# Lire l'erreur affichée

# Souvent : Dépendance manquante
cd front-end
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Upload S3 échoue

#### Erreur : "Access Denied" S3

**Cause** : Permissions IAM insuffisantes

**Solution** :
1. AWS IAM → Utilisateurs → `gsb-s3-user`
2. Onglet **Autorisations**
3. Vérifier que `AmazonS3FullAccess` est attaché
4. Sinon : **Ajouter des autorisations** → Attacher la stratégie

---

#### Erreur : "InvalidAccessKeyId"

**Cause** : Clés AWS incorrectes

**Solution** :
```bash
# Vérifier .env
cat back-end/.env | grep AWS

# Les clés doivent ressembler à :
# AWS_ACCESS_KEY_ID=AKIA... (20 caractères)
# AWS_SECRET_ACCESS_KEY=... (40 caractères)

# Si incorrect : Régénérer des clés IAM
```

---

### Google OAuth ne fonctionne pas

#### Erreur : "redirect_uri_mismatch"

**Cause** : URI de callback non autorisée

**Solution** :
1. Google Cloud Console → **Identifiants**
2. Cliquer sur votre ID client OAuth
3. **URI de redirection autorisés** :
   - Ajouter : `http://localhost:5000/auth/google/callback`
4. Enregistrer
5. Attendre 5 minutes (propagation)
6. Réessayer

---

## 🚀 Déploiement en production

### Backend sur Render

1. Aller sur https://render.com
2. **New → Web Service**
3. Connecter votre repo GitHub
4. Configuration :
   - Name : `gsb-api`
   - Environment : `Node`
   - Build Command : `cd back-end && npm install`
   - Start Command : `cd back-end && npm start`
5. **Environment Variables** : Ajouter TOUTES les variables de `.env`
   - ⚠️ Changer `GOOGLE_CALLBACK_URL` en `https://gsb-api.onrender.com/auth/google/callback`
   - ⚠️ Changer `FRONTEND_URL` en URL Vercel
   - ⚠️ `NODE_ENV=production`
6. Créer le service

### Frontend sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd front-end
vercel --prod

# Suivre les instructions
# ✅ URL de production : https://gsb-app.vercel.app
```

### Configuration finale

1. **Mettre à jour les CORS** (backend) :
   ```javascript
   origin: 'https://gsb-app.vercel.app'
   ```

2. **Mettre à jour l'URL API** (frontend) :
   ```env
   VITE_API_URL=https://gsb-api.onrender.com
   ```

3. **Tester en production** :
   - https://gsb-app.vercel.app

---

## 📞 Support

### Documentation du projet

| Document | Contenu |
|----------|---------|
| [🏠 README](./README.md) | Vue d'ensemble et démarrage rapide |
| [📘 Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) | Architecture détaillée, API REST, base de données, sécurité |
| [📗 Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) | Guide utilisateur complet avec captures et FAQ |
| [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) | Mapping des compétences avec exemples de code |

### Liens rapides

- 🔍 **Problème d'installation ?** → [Section Résolution de problèmes](#résolution-de-problèmes)
- 🏗️ **Comprendre l'architecture ?** → [Documentation Technique - Architecture](./DOCUMENTATION_TECHNIQUE.md#architecture-technique)
- 📊 **Voir les modèles de données ?** → [Documentation Technique - Base de données](./DOCUMENTATION_TECHNIQUE.md#base-de-données)
- 🔐 **Comprendre la sécurité ?** → [Documentation Technique - Sécurité](./DOCUMENTATION_TECHNIQUE.md#sécurité)

### Communauté

- **GitHub Issues** : Signaler un bug
- **Email** : support@gsb.fr (exemple)

---

## ✅ Checklist finale

### Installation locale

- [ ] Node.js ≥ 18.0.0 installé
- [ ] MongoDB Atlas configuré et accessible
- [ ] AWS S3 bucket créé et configuré
- [ ] Fichier `back-end/.env` complet
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Création de compte fonctionne
- [ ] Connexion fonctionne
- [ ] Upload de justificatif fonctionne

### Déploiement production

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement prod configurées
- [ ] CORS mis à jour
- [ ] Google OAuth callback URL mis à jour
- [ ] Tests en production réussis

---

**🎉 Félicitations !**

Votre application GSB est maintenant installée et fonctionnelle.

Pour toute question, consultez la documentation ou ouvrez une issue sur GitHub.

---

**📅 Dernière mise à jour** : Décembre 2025  
**👨‍💻 Auteur** : [Votre nom]  
**🎓 Projet** : BTS SIO SLAM

---

*Guide d'installation réalisé dans le cadre du BTS SIO option SLAM*

