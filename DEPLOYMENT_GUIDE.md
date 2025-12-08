# 🚀 Guide de déploiement - GSB

Guide complet pour déployer l'application GSB sur Render et autres plateformes.

---

## 📋 Prérequis

Avant de déployer, assurez-vous d'avoir :

- ✅ Un compte [Render.com](https://render.com) (gratuit)
- ✅ Un cluster [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
- ✅ Un bucket [AWS S3](https://aws.amazon.com/s3/) pour les fichiers
- ✅ (Optionnel) Des credentials [Google OAuth](https://console.cloud.google.com/)
- ✅ Le code sur un dépôt Git (GitHub, GitLab, Bitbucket)

---

## 🗄️ 1. Configuration MongoDB Atlas

### Étape 1 : Créer un cluster

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Se connecter ou créer un compte
3. Cliquer sur "Build a Database"
4. Choisir "FREE" (M0 Sandbox)
5. Sélectionner une région proche (ex: eu-west-1)
6. Nommer le cluster : "GSB-Cluster"
7. Cliquer sur "Create"

### Étape 2 : Créer un utilisateur de base de données

1. Dans "Security" → "Database Access"
2. Cliquer sur "Add New Database User"
3. Méthode d'authentification : "Password"
4. Username : `gsb_admin`
5. Password : (générer un mot de passe fort)
6. Database User Privileges : "Read and write to any database"
7. Cliquer sur "Add User"

### Étape 3 : Autoriser les connexions

1. Dans "Security" → "Network Access"
2. Cliquer sur "Add IP Address"
3. Cliquer sur "Allow Access from Anywhere" (0.0.0.0/0)
4. Ou ajouter l'IP de Render si vous la connaissez
5. Cliquer sur "Confirm"

### Étape 4 : Obtenir l'URI de connexion

1. Dans "Database" → "Connect"
2. Choisir "Connect your application"
3. Driver : "Node.js", Version : "5.5 or later"
4. Copier l'URI :
```
mongodb+srv://gsb_admin:<password>@gsb-cluster.xxxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Remplacer `<password>` par votre mot de passe
6. Ajouter le nom de la base de données : `/gsb_db`
```
mongodb+srv://gsb_admin:VotreMotDePasse@gsb-cluster.xxxxxx.mongodb.net/gsb_db?retryWrites=true&w=majority
```

---

## ☁️ 2. Configuration AWS S3

### Étape 1 : Créer un bucket

1. Aller sur [AWS Console](https://console.aws.amazon.com/s3/)
2. Cliquer sur "Create bucket"
3. Nom du bucket : `gsb-frais-justificatifs` (doit être unique)
4. Région : choisir la plus proche (ex: eu-west-1)
5. Désactiver "Block all public access" si vous voulez des liens publics
6. Cliquer sur "Create bucket"

### Étape 2 : Configurer les permissions

1. Sélectionner votre bucket
2. Aller dans "Permissions"
3. "Bucket Policy" → "Edit"
4. Ajouter cette politique :
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gsb-frais-justificatifs/*"
    }
  ]
}
```

### Étape 3 : Créer un utilisateur IAM

1. Aller dans [IAM Console](https://console.aws.amazon.com/iam/)
2. "Users" → "Add users"
3. Nom : `gsb-s3-user`
4. Access type : "Programmatic access"
5. Permissions : "Attach existing policies directly"
6. Chercher et sélectionner : "AmazonS3FullAccess"
7. Créer l'utilisateur
8. **⚠️ IMPORTANT** : Copier l'Access Key ID et le Secret Access Key

---

## 🔐 3. Configuration Google OAuth (Optionnel)

### Étape 1 : Créer un projet

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet : "GSB-Auth"
3. Sélectionner le projet

### Étape 2 : Activer l'API Google+

1. "APIs & Services" → "Library"
2. Chercher "Google+ API"
3. Cliquer et "Enable"

### Étape 3 : Créer des identifiants OAuth

1. "APIs & Services" → "Credentials"
2. "Create Credentials" → "OAuth client ID"
3. Application type : "Web application"
4. Name : "GSB OAuth"
5. Authorized JavaScript origins :
   - `http://localhost:5000` (développement)
   - `https://votre-app.onrender.com` (production)
6. Authorized redirect URIs :
   - `http://localhost:5000/auth/google/callback` (développement)
   - `https://votre-app.onrender.com/auth/google/callback` (production)
7. Créer
8. Copier le Client ID et Client Secret

---

## 🌐 4. Déploiement sur Render

### Étape 1 : Préparer le projet

1. **Créer un fichier .gitignore** (si pas déjà fait) :
```
node_modules/
.env
*.log
.DS_Store
```

2. **Vérifier package.json** :
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon --env-file=.env index.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

3. **Commit et push sur Git** :
```bash
git add .
git commit -m "Prêt pour le déploiement"
git push origin main
```

### Étape 2 : Créer le Web Service sur Render

1. Aller sur [Render Dashboard](https://dashboard.render.com/)
2. Cliquer sur "New +" → "Web Service"
3. Connecter votre dépôt Git
4. Sélectionner le repository GSB
5. Configurer :
   - **Name** : `gsb-backend`
   - **Region** : Europe (Central)
   - **Branch** : `main`
   - **Root Directory** : `back-end`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`

### Étape 3 : Configurer les variables d'environnement

Dans "Environment" → "Environment Variables", ajouter :

```
MONGO_URI=mongodb+srv://gsb_admin:VotreMotDePasse@gsb-cluster.xxxxxx.mongodb.net/gsb_db?retryWrites=true&w=majority

SALT=<générer un secret de 32+ caractères>
JWT_SECRET=<générer un secret de 32+ caractères>
SESSION_SECRET=<générer un secret de 32+ caractères>

AWS_ACCESS_KEY_ID=votre_access_key_id
AWS_SECRET_ACCESS_KEY=votre_secret_access_key
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=gsb-frais-justificatifs

FRONTEND_URL=https://gsb-frontend.onrender.com
GOOGLE_CALLBACK_URL=https://gsb-backend.onrender.com/auth/google/callback

GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret

NODE_ENV=production
PORT=5000
```

**💡 Pour générer des secrets :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Étape 4 : Déployer

1. Cliquer sur "Create Web Service"
2. Render va :
   - Cloner votre repo
   - Installer les dépendances
   - Démarrer le serveur
3. Attendre que le déploiement soit "Live" (environ 2-3 minutes)
4. Noter l'URL : `https://gsb-backend.onrender.com`

### Étape 5 : Tester le déploiement

**Test basique :**
```bash
curl https://gsb-backend.onrender.com/api/test
```

**Résultat attendu :**
```json
{
  "message": "API fonctionne correctement"
}
```

**Test de création d'utilisateur :**
```bash
curl -X POST https://gsb-backend.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

---

## 🎨 5. Déploiement du Frontend (React)

### Étape 1 : Configurer l'URL du backend

Dans `front-end/src/api/config.js` :
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const config = {
  apiUrl: API_URL,
  endpoints: {
    login: `${API_URL}/api/auth/login`,
    users: `${API_URL}/api/users`,
    bills: `${API_URL}/api/bills`,
  }
}
```

### Étape 2 : Créer le service frontend sur Render

1. "New +" → "Static Site"
2. Connecter le même repo
3. Configurer :
   - **Name** : `gsb-frontend`
   - **Branch** : `main`
   - **Root Directory** : `front-end`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`

4. Environment Variables :
```
VITE_API_URL=https://gsb-backend.onrender.com
```

5. Cliquer sur "Create Static Site"

6. URL du frontend : `https://gsb-frontend.onrender.com`

### Étape 3 : Mettre à jour les URLs backend

1. Retourner dans le backend sur Render
2. Modifier `FRONTEND_URL` :
```
FRONTEND_URL=https://gsb-frontend.onrender.com
```

3. Mettre à jour Google OAuth redirect URIs si nécessaire

---

## 🔄 6. Mise à jour et redéploiement

### Déploiement automatique

Render redéploie automatiquement à chaque push sur la branche `main`.

```bash
# Faire des modifications
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
# Render redéploie automatiquement
```

### Déploiement manuel

1. Aller sur Render Dashboard
2. Sélectionner votre service
3. Cliquer sur "Manual Deploy" → "Deploy latest commit"

---

## 🐛 7. Monitoring et logs

### Voir les logs en temps réel

1. Dashboard Render → Sélectionner votre service
2. Onglet "Logs"
3. Les logs s'affichent en temps réel

### Logs utiles à surveiller

```bash
✅ Connecté à MongoDB avec succès
🚀 Serveur en cours d'exécution sur le port 5000
📡 API disponible sur http://...
```

### Erreurs courantes

**❌ MongoDB connection error**
```
Solution :
- Vérifier MONGO_URI
- Vérifier que 0.0.0.0/0 est autorisé dans Network Access
- Vérifier le mot de passe dans l'URI
```

**❌ SALT is not defined**
```
Solution :
- Ajouter SALT dans les environment variables Render
```

**❌ Cannot upload to S3**
```
Solution :
- Vérifier AWS_ACCESS_KEY_ID et AWS_SECRET_ACCESS_KEY
- Vérifier que l'utilisateur IAM a les permissions S3
```

---

## 💰 8. Plan Free de Render

### Limitations du plan gratuit

- ⏰ Le service s'arrête après 15 minutes d'inactivité
- 🐌 Redémarrage lent (environ 30-50 secondes au premier accès)
- 💾 512 MB RAM
- 🔄 750 heures/mois (suffisant pour 1 service)

### Optimisations

**Keep-Alive automatique** (optionnel) :
Créer un service de ping externe (UptimeRobot, cron-job.org) qui appelle votre API toutes les 10 minutes :
```
https://gsb-backend.onrender.com/api/test
```

---

## 🌍 9. Utiliser un nom de domaine personnalisé

### Avec Render

1. Acheter un domaine (ex: gsb-app.com)
2. Dans Render → Settings → Custom Domain
3. Ajouter votre domaine : `api.gsb-app.com`
4. Configurer les DNS chez votre registrar :
   - Type : CNAME
   - Name : api
   - Value : gsb-backend.onrender.com

---

## ✅ 10. Checklist de déploiement

### Avant le déploiement

- [ ] Code testé localement
- [ ] Variables d'environnement préparées
- [ ] MongoDB Atlas configuré et IP autorisée
- [ ] AWS S3 bucket créé et accessible
- [ ] Google OAuth configuré (si utilisé)
- [ ] .gitignore présent (.env, node_modules)
- [ ] package.json contient les bons scripts
- [ ] Code pushé sur Git

### Après le déploiement

- [ ] Service backend "Live" sur Render
- [ ] Test de l'endpoint `/api/test`
- [ ] Test de création d'utilisateur
- [ ] Test de login
- [ ] Test de création de facture
- [ ] Vérifier les logs (pas d'erreurs)
- [ ] Frontend déployé et connecté au backend
- [ ] Google OAuth fonctionne (si utilisé)
- [ ] Upload de fichiers fonctionne (S3)

---

## 🔐 11. Sécurité en production

### Best practices

1. **Secrets forts** : Utiliser des secrets de 32+ caractères aléatoires
2. **HTTPS uniquement** : Render le fait automatiquement
3. **CORS strict** : Autoriser uniquement votre frontend
4. **Rate limiting** : Ajouter express-rate-limit
5. **Helmet.js** : Protéger contre les vulnérabilités courantes
6. **Validation** : Valider toutes les entrées utilisateur
7. **Logs** : Ne pas logger les mots de passe ou tokens

### Ajouter Helmet et Rate Limiting

```bash
npm install helmet express-rate-limit
```

Dans `index.js` :
```javascript
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Sécurité
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requêtes par IP
})
app.use('/api/', limiter)
```

---

## 📊 12. Monitoring avancé (optionnel)

### Services recommandés

1. **Sentry** : Tracking d'erreurs
   - https://sentry.io/
   - Free tier : 5K erreurs/mois

2. **LogRocket** : Session replay et monitoring
   - https://logrocket.com/
   - Free tier : 1K sessions/mois

3. **UptimeRobot** : Monitoring de disponibilité
   - https://uptimerobot.com/
   - Free tier : 50 monitors

---

## 🎓 13. Commandes utiles

### Générer des secrets
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Tester MongoDB localement
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"
```

### Vérifier les variables d'environnement (local)
```bash
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

### Build et test local avant déploiement
```bash
cd back-end
npm install
npm start
# Dans un autre terminal
curl http://localhost:5000/api/test
```

---

## 📞 Support et ressources

- 📖 [Documentation Render](https://render.com/docs)
- 📖 [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- 📖 [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- 💬 [Render Community](https://community.render.com/)

---

**✨ Bon déploiement !**

