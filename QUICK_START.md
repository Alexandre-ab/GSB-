# ⚡ Quick Start - GSB

Guide de démarrage rapide en 5 minutes pour lancer le projet GSB localement.

---

## 🎯 Ce qu'on va faire

1. Installer les dépendances
2. Configurer les variables d'environnement
3. Démarrer le serveur
4. Tester avec Postman
5. Créer un premier utilisateur

---

## 📋 Prérequis

- ✅ Node.js >= 18.0.0 ([Télécharger](https://nodejs.org/))
- ✅ MongoDB Atlas account ([S'inscrire gratuitement](https://www.mongodb.com/cloud/atlas))
- ✅ Postman ([Télécharger](https://www.postman.com/downloads/))

---

## 🚀 Installation en 5 étapes

### 1️⃣ Cloner et installer

```bash
# Cloner le projet
git clone <url-du-repo>
cd GSB-

# Installer les dépendances backend
cd back-end
npm install
```

### 2️⃣ Configurer MongoDB Atlas (2 minutes)

1. Aller sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Créer un cluster gratuit (M0)
3. Créer un utilisateur : `admin` / `admin123`
4. Autoriser toutes les IPs : `0.0.0.0/0`
5. Obtenir l'URI de connexion : `Connect` → `Connect your application`

Votre URI ressemblera à :
```
mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/gsb_db?retryWrites=true&w=majority
```

### 3️⃣ Créer le fichier .env

Dans le dossier `back-end/`, créer un fichier `.env` :

```bash
# Copier ce contenu dans back-end/.env

# MongoDB (remplacer avec votre URI)
MONGO_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/gsb_db?retryWrites=true&w=majority

# Secrets (vous pouvez garder ces valeurs pour le développement)
SALT=dev_salt_minimum_32_caracteres_aleatoires_pour_test
JWT_SECRET=dev_jwt_secret_minimum_32_caracteres_aleatoires_pour_test
SESSION_SECRET=dev_session_secret_minimum_32_caracteres_aleatoires

# AWS S3 (optionnel pour commencer, mettre des valeurs fictives)
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=gsb-bucket

# URLs
FRONTEND_URL=http://localhost:5176
PORT=5000

# Environnement
NODE_ENV=development
```

### 4️⃣ Démarrer le serveur

```bash
# Dans le dossier back-end/
npm run dev
```

**✅ Si tout fonctionne, vous devriez voir :**
```
✅ Connecté à MongoDB avec succès
🚀 Serveur en cours d'exécution sur le port 5000
📡 API disponible sur http://localhost:5000/api
```

---

## 🧪 Test rapide (2 minutes)

### Test 1 : API fonctionne

Ouvrir un navigateur : http://localhost:5000/api/test

**Résultat attendu :**
```json
{
  "message": "API fonctionne correctement"
}
```

### Test 2 : Créer un utilisateur avec Postman

1. **Ouvrir Postman**

2. **Créer une nouvelle requête :**
   - Méthode : `POST`
   - URL : `http://localhost:5000/api/users`
   - Headers : `Content-Type: application/json`
   - Body (raw - JSON) :
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "role": "user"
   }
   ```

3. **Cliquer sur "Send"**

**✅ Résultat attendu (201 Created) :**
```json
{
  "_id": "65f8a9c7...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "type_sso": "local",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Test 3 : Se connecter

1. **Nouvelle requête Postman :**
   - Méthode : `POST`
   - URL : `http://localhost:5000/api/auth/login`
   - Headers : `Content-Type: application/json`
   - Body (raw - JSON) :
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Cliquer sur "Send"**

**✅ Résultat attendu (200 OK) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**🎉 Félicitations ! L'API fonctionne !**

---

## 📚 Prochaines étapes

### Pour continuer :

1. **Lire la documentation complète**
   - [DOCUMENTATION.md](./DOCUMENTATION.md) - Toutes les routes API
   - [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Guide Postman complet

2. **Tester toutes les routes**
   - Créer des utilisateurs
   - Créer des factures (nécessite AWS S3)
   - Mettre à jour / Supprimer

3. **Déployer en production**
   - [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guide de déploiement Render

---

## 🔑 Routes principales à tester

### Utilisateurs

```bash
# Créer un utilisateur
POST http://localhost:5000/api/users
Body: { name, email, password, role }

# Se connecter
POST http://localhost:5000/api/auth/login
Body: { email, password }
→ Copier le token reçu

# Récupérer tous les utilisateurs (nécessite le token)
GET http://localhost:5000/api/users
Header: Authorization: Bearer <votre_token>

# Mettre à jour un utilisateur
PUT http://localhost:5000/api/users?email=test@example.com
Header: Authorization: Bearer <votre_token>
Body: { name, newEmail, password, role }

# Supprimer un utilisateur
DELETE http://localhost:5000/api/users?email=test@example.com
Header: Authorization: Bearer <votre_token>
```

### Factures (nécessite AWS S3 configuré)

```bash
# Créer une facture
POST http://localhost:5000/api/bills
Header: Authorization: Bearer <votre_token>
Body: multipart/form-data (metadata + fichier)

# Récupérer les factures
GET http://localhost:5000/api/bills
Header: Authorization: Bearer <votre_token>

# Mettre à jour une facture
PUT http://localhost:5000/api/bills/:id
Header: Authorization: Bearer <votre_token>
Body: { status, amount, description }

# Supprimer une facture
DELETE http://localhost:5000/api/bills/:id
Header: Authorization: Bearer <votre_token>
```

---

## 🐛 Problèmes courants

### ❌ Erreur : "Cannot connect to MongoDB"

**Solutions :**
1. Vérifier que `MONGO_URI` dans `.env` est correct
2. Vérifier que votre IP est autorisée dans MongoDB Atlas (Network Access)
3. Ajouter `0.0.0.0/0` pour autoriser toutes les IPs

### ❌ Erreur : "SALT is not defined"

**Solution :**
```bash
# Vérifier que .env existe dans back-end/
ls -la back-end/.env

# Vérifier que SALT est défini
cat back-end/.env | grep SALT
```

### ❌ Erreur : "Port 5000 already in use"

**Solutions :**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Ou changer le port dans .env
PORT=5001
```

### ❌ Erreur : "Invalid token"

**Solutions :**
1. Le token a expiré (24h) → Se reconnecter
2. Format incorrect → Utiliser `Bearer <token>`
3. Token manquant → Ajouter le header `Authorization`

---

## 💡 Commandes utiles

### Générer un secret aléatoire
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Vérifier la version de Node.js
```bash
node --version  # Doit être >= 18.0.0
npm --version   # Doit être >= 9.0.0
```

### Réinstaller les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

### Voir les logs en temps réel
```bash
npm run dev  # Mode développement avec auto-reload
```

### Arrêter le serveur
```
Ctrl + C
```

---

## 📦 Structure minimale pour démarrer

```
GSB-/
├── back-end/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── .env          ← IMPORTANT : créer ce fichier
├── DOCUMENTATION.md  ← Lire pour plus de détails
├── POSTMAN_GUIDE.md  ← Guide de test
└── README.md         ← Vue d'ensemble
```

---

## 🎓 Concepts clés

### Flux d'authentification

```
1. Créer un utilisateur
   POST /api/users

2. Se connecter
   POST /api/auth/login
   → Récupère un JWT

3. Utiliser le JWT pour les routes protégées
   GET /api/users
   Header: Authorization: Bearer <JWT>
```

### Hashing des mots de passe

```
Mot de passe en clair : "password123"
            ↓
Hook pre-save Mongoose
            ↓
SHA-256(password + SALT)
            ↓
Hash stocké en DB : "a3f7b8c9d2e1f4g5..."
```

### JWT (JSON Web Token)

```
Contenu du token :
{
  id: "65f8a9c7...",    # ID de l'utilisateur
  role: "user",         # Rôle (user/admin)
  email: "test@...",    # Email
  iat: 1705324800,      # Date de création
  exp: 1705411200       # Date d'expiration (24h)
}
```

---

## 🎯 Checklist de démarrage

- [ ] Node.js >= 18 installé
- [ ] Projet cloné
- [ ] `npm install` exécuté
- [ ] Compte MongoDB Atlas créé
- [ ] Cluster MongoDB créé
- [ ] Utilisateur DB créé
- [ ] IP autorisée (0.0.0.0/0)
- [ ] Fichier `.env` créé
- [ ] `MONGO_URI` configuré
- [ ] Serveur démarré (`npm run dev`)
- [ ] Test `/api/test` OK
- [ ] Postman installé
- [ ] Premier utilisateur créé
- [ ] Login testé et token reçu
- [ ] Route protégée testée avec token

---

## 📞 Besoin d'aide ?

1. ✅ Vérifier cette checklist
2. ✅ Lire les messages d'erreur dans le terminal
3. ✅ Consulter [DOCUMENTATION.md](./DOCUMENTATION.md)
4. ✅ Vérifier les variables dans `.env`
5. ✅ Tester avec les exemples Postman

---

## 📚 Documentation complète

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentation technique complète
- **[README.md](./README.md)** - Vue d'ensemble du projet
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Guide de test Postman
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Guide de déploiement

---

**✨ Bon développement !**

**Temps estimé pour démarrer : 5-10 minutes** ⏱️

