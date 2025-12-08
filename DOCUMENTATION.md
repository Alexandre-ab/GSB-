# 📚 Documentation complète - Projet GSB

## 🎯 Vue d'ensemble du projet

**GSB** (Gestion de Frais Professionnels) est une application full-stack permettant aux utilisateurs de soumettre et gérer leurs notes de frais.

### Technologies utilisées :

#### Backend :
- **Node.js** + **Express.js** - Serveur et API REST
- **MongoDB** + **Mongoose** - Base de données NoSQL
- **JWT** - Authentification par tokens
- **Passport.js** - Authentification Google OAuth 2.0
- **Multer** - Upload de fichiers
- **AWS S3** - Stockage des justificatifs
- **SHA-256** - Hashing des mots de passe

#### Frontend :
- **React** + **Vite** - Interface utilisateur
- **React Router** - Navigation

---

## 📁 Structure du projet

```
GSB-/
├── back-end/
│   ├── api/
│   │   └── services/
│   │       └── authGoogle.js          # Configuration Google OAuth
│   ├── controllers/
│   │   ├── authentication_controller.js  # Logique d'authentification
│   │   ├── user_controller.js           # Logique des utilisateurs
│   │   └── bill_controller.js           # Logique des factures
│   ├── models/
│   │   ├── user_model.js                # Schéma MongoDB User
│   │   └── bill_model.js                # Schéma MongoDB Bill
│   ├── routes/
│   │   ├── authentication_route.js      # Routes d'authentification
│   │   ├── user_route.js                # Routes des utilisateurs
│   │   └── bill_route.js                # Routes des factures
│   ├── middleware/
│   │   └── upload.js                    # Configuration Multer
│   ├── utils/
│   │   └── s3.js                        # Utilitaires AWS S3
│   ├── index.js                         # Point d'entrée du serveur
│   ├── package.json                     # Dépendances Node.js
│   └── .env                             # Variables d'environnement
└── front-end/
    └── src/
        └── components/
            └── Auth/                    # Composants d'authentification

```

---

## 🗄️ Modèles de données

### 1. Modèle User

```javascript
{
  _id: ObjectId,
  name: String,              // Nom complet
  email: String,             // Email unique
  password: String,          // Mot de passe hashé (SHA-256 + SALT)
  role: String,              // "user" ou "admin"
  type_sso: String,          // "local", "google", ou "microsoft"
  external_id: String,       // ID externe pour SSO (optionnel)
  createdAt: Date            // Date de création
}
```

**Exemple :**
```json
{
  "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
  "name": "Alice Martin",
  "email": "alice.martin@example.com",
  "password": "a3f7b8c9d2e1f4g5h6i7j8k9l0m1n2o3...",
  "role": "user",
  "type_sso": "local",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Modèle Bill (Facture)

```javascript
{
  _id: ObjectId,
  date: String,              // Date de la dépense
  amount: Number,            // Montant en euros
  proof: String,             // URL du justificatif (S3)
  description: String,       // Description de la dépense
  status: String,            // "pending", "approved", "rejected"
  type: String,              // Type de frais (transport, repas, hébergement, etc.)
  user: ObjectId,            // Référence vers l'utilisateur
  createdAt: String          // Date de création
}
```

**Exemple :**
```json
{
  "_id": "65f8b1d8e5f6g7h8i9j0k2",
  "date": "2024-01-15",
  "amount": 45.50,
  "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
  "description": "Déjeuner client",
  "status": "pending",
  "type": "repas",
  "user": "65f8a9c7d4e5f6g7h8i9j0k1",
  "createdAt": "2024-01-15T14:20:00.000Z"
}
```

---

## 🔐 Système d'authentification

### 1. Authentification locale (Email + Mot de passe)

#### Processus d'inscription :
1. L'utilisateur soumet : `name`, `email`, `password`, `role`
2. Le hook `pre-save` hash le mot de passe : `SHA-256(password + SALT)`
3. L'utilisateur est créé dans MongoDB
4. Réponse sans le mot de passe

#### Processus de connexion :
1. L'utilisateur soumet : `email`, `password`
2. Le serveur recherche l'utilisateur par email
3. Hash du mot de passe fourni : `SHA-256(password + SALT)`
4. Comparaison avec le hash stocké
5. Si correct : génération d'un JWT valide 24h
6. Le JWT contient : `{ id, role, email }`

#### Format du JWT :
```javascript
{
  id: "65f8a9c7d4e5f6g7h8i9j0k1",
  role: "user",
  email: "alice.martin@example.com",
  iat: 1705324800,
  exp: 1705411200
}
```

---

### 2. Authentification Google OAuth

#### Flux OAuth :
```
1. Utilisateur clique "Se connecter avec Google"
   ↓
2. Redirection vers Google
   GET /auth/google
   ↓
3. Google demande l'autorisation
   ↓
4. Google redirige vers notre callback
   GET /auth/google/callback?code=...
   ↓
5. Passport récupère le profil Google
   ↓
6. findOrCreateUser() crée ou récupère l'utilisateur
   ↓
7. Génération d'un JWT
   ↓
8. Redirection vers le frontend avec le token
   https://frontend.com/auth/callback?token=...
```

---

## 🛣️ Routes API complètes

### 🔓 Routes publiques (sans authentification)

#### 1. Créer un utilisateur
```http
POST /api/users
Content-Type: application/json

{
  "name": "Alice Martin",
  "email": "alice.martin@example.com",
  "password": "monMotDePasse123",
  "role": "user"
}
```

**Réponse (201) :**
```json
{
  "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
  "name": "Alice Martin",
  "email": "alice.martin@example.com",
  "role": "user",
  "type_sso": "local",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 2. Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice.martin@example.com",
  "password": "monMotDePasse123"
}
```

**Réponse (200) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 3. Authentification Google
```http
GET /auth/google
```
Redirige vers Google pour l'authentification.

---

### 🔒 Routes protégées (nécessitent un JWT)

**Header requis pour toutes les routes protégées :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### 4. Récupérer tous les utilisateurs
```http
GET /api/users
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
[
  {
    "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
    "name": "Alice Martin",
    "email": "alice.martin@example.com",
    "role": "user",
    "type_sso": "local",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### 5. Filtrer les utilisateurs par email
```http
GET /api/users?email=alice.martin@example.com
Authorization: Bearer <token>
```

---

#### 6. Mettre à jour un utilisateur
```http
PUT /api/users?email=alice.martin@example.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Dupont",
  "newEmail": "alice.dupont@example.com",
  "password": "nouveauMotDePasse",
  "role": "admin"
}
```

**Réponse (200) :**
```json
{
  "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
  "name": "Alice Dupont",
  "email": "alice.dupont@example.com",
  "role": "admin",
  "type_sso": "local",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 7. Supprimer un utilisateur
```http
DELETE /api/users?email=alice.martin@example.com
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
{
  "message": "User deleted"
}
```

---

### 💰 Routes des factures

#### 8. Créer une facture (avec upload de fichier)
```http
POST /api/bills
Authorization: Bearer <token>
Content-Type: multipart/form-data

metadata: {
  "date": "2024-01-15",
  "amount": 45.50,
  "description": "Déjeuner client",
  "status": "pending",
  "type": "repas"
}
proof: [fichier image]
```

**Réponse (201) :**
```json
{
  "_id": "65f8b1d8e5f6g7h8i9j0k2",
  "date": "2024-01-15",
  "amount": 45.50,
  "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
  "description": "Déjeuner client",
  "status": "pending",
  "type": "repas",
  "user": "65f8a9c7d4e5f6g7h8i9j0k1",
  "createdAt": "2024-01-15T14:20:00.000Z"
}
```

---

#### 9. Récupérer les factures
```http
GET /api/bills
Authorization: Bearer <token>
```

**Logique :**
- Si `role === "admin"` : retourne toutes les factures
- Sinon : retourne uniquement les factures de l'utilisateur connecté

**Réponse (200) :**
```json
[
  {
    "_id": "65f8b1d8e5f6g7h8i9j0k2",
    "date": "2024-01-15",
    "amount": 45.50,
    "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
    "description": "Déjeuner client",
    "status": "pending",
    "type": "repas",
    "user": "65f8a9c7d4e5f6g7h8i9j0k1",
    "createdAt": "2024-01-15T14:20:00.000Z"
  }
]
```

---

#### 10. Récupérer une facture par ID
```http
GET /api/bills/65f8b1d8e5f6g7h8i9j0k2
Authorization: Bearer <token>
```

---

#### 11. Mettre à jour une facture
```http
PUT /api/bills/65f8b1d8e5f6g7h8i9j0k2
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "amount": 50.00
}
```

---

#### 12. Supprimer une facture
```http
DELETE /api/bills/65f8b1d8e5f6g7h8i9j0k2
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
{
  "message": "Bill deleted"
}
```

---

## 🔧 Configuration et déploiement

### Variables d'environnement (.env)

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Sécurité
SALT=votre_salt_tres_secret_minimum_32_caracteres
JWT_SECRET=votre_jwt_secret_tres_secret_minimum_32_caracteres
SESSION_SECRET=votre_session_secret_tres_secret_minimum_32_caracteres

# Google OAuth
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# AWS S3
AWS_ACCESS_KEY_ID=votre_access_key_aws
AWS_SECRET_ACCESS_KEY=votre_secret_key_aws
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=gsb-bucket

# URLs
FRONTEND_URL=http://localhost:5176
PORT=5000

# Environnement
NODE_ENV=development
```

---

### Installation locale

#### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd GSB-
```

#### 2. Installer les dépendances backend
```bash
cd back-end
npm install
```

#### 3. Créer le fichier .env
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

#### 4. Démarrer le serveur backend
```bash
npm run dev  # Mode développement avec nodemon
# ou
npm start    # Mode production
```

Le serveur démarre sur `http://localhost:5000`

---

### Déploiement sur Render

#### 1. Backend

**Build Command :**
```bash
npm install
```

**Start Command :**
```bash
npm start
```

**Variables d'environnement à configurer :**
- `MONGO_URI`
- `SALT`
- `JWT_SECRET`
- `SESSION_SECRET`
- `FRONTEND_URL` (URL de votre frontend déployé)
- `GOOGLE_CALLBACK_URL` (URL de votre backend + /auth/google/callback)
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`
- `NODE_ENV=production`

---

## 🧪 Tests avec Postman

### Collection Postman

1. **Créer une collection "GSB API"**

2. **Ajouter des variables d'environnement :**
   - `base_url` = `http://localhost:5000`
   - `token` = (sera rempli automatiquement après login)

3. **Ajouter un script de test dans la requête Login :**
```javascript
// Dans l'onglet "Tests" de la requête POST /api/auth/login
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

4. **Utiliser le token automatiquement :**
Dans les requêtes protégées, ajouter dans Headers :
```
Authorization: Bearer {{token}}
```

---

## 🔒 Sécurité

### 1. Hashing des mots de passe
- Algorithme : **SHA-256**
- Salt ajouté : oui (variable `SALT`)
- Le mot de passe n'est **jamais** stocké en clair

### 2. JWT
- Durée de validité : **24 heures**
- Signé avec `JWT_SECRET`
- Contient : `id`, `role`, `email`

### 3. Middleware de vérification
- `verifyToken` : Vérifie la validité du JWT
- `isAdmin` : Vérifie que l'utilisateur est admin

### 4. Upload de fichiers
- Limite de taille : **5 MB**
- Types acceptés : **jpg, jpeg, png, gif**
- Stockage : **AWS S3**

### 5. CORS
- Configuré pour accepter uniquement le frontend autorisé
- Credentials activés

---

## 📊 Flux de données complets

### Exemple : Création et validation d'une facture

```
1. Utilisateur se connecte
   POST /api/auth/login
   → Reçoit un JWT
   
2. Utilisateur crée une facture
   POST /api/bills
   Header: Authorization Bearer <JWT>
   Body: metadata + fichier image
   → Le middleware verifyToken vérifie le JWT
   → L'image est uploadée sur S3
   → La facture est créée avec status="pending"
   
3. Admin récupère toutes les factures
   GET /api/bills
   Header: Authorization Bearer <JWT_ADMIN>
   → Reçoit toutes les factures (car role="admin")
   
4. Admin valide la facture
   PUT /api/bills/<id>
   Header: Authorization Bearer <JWT_ADMIN>
   Body: { "status": "approved" }
   → La facture est mise à jour
   
5. Utilisateur consulte ses factures
   GET /api/bills
   Header: Authorization Bearer <JWT>
   → Reçoit uniquement ses factures
   → Voit que sa facture est "approved"
```

---

## 🎓 Concepts clés expliqués

### 1. Architecture MVC
- **Model** : Définit la structure des données (Mongoose schemas)
- **View** : Interface utilisateur (React frontend)
- **Controller** : Logique métier (controllers/)

### 2. Middleware Express
Un middleware est une fonction qui s'exécute **avant** le handler de route.

**Exemple :**
```javascript
router.get('/api/bills', verifyToken, getBills)
//                       ↑ middleware  ↑ handler
```

`verifyToken` s'exécute d'abord, vérifie le JWT, puis passe à `getBills`.

### 3. Mongoose Hooks
Les hooks sont des fonctions qui s'exécutent automatiquement avant/après certaines opérations.

**Exemple :**
```javascript
userSchema.pre('save', async function(next) {
  // S'exécute AVANT user.save()
  this.password = sha256(this.password + process.env.SALT)
  next()
})
```

### 4. Populate (références MongoDB)
Les factures contiennent une référence vers l'utilisateur :

```javascript
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

Pour récupérer les infos complètes de l'utilisateur :
```javascript
const bill = await Bill.findById(id).populate('user')
// bill.user contiendra l'objet User complet au lieu de juste l'ID
```

---

## 🐛 Résolution de problèmes

### Erreur : "User is not a constructor"
**Cause :** Problème d'import du modèle User  
**Solution :** Utiliser `const { User } = require('../models/user_model')`

### Erreur : "SALT is not defined"
**Cause :** Variable SALT manquante dans .env  
**Solution :** Ajouter `SALT=votre_salt_secret` dans .env

### Erreur : "MongoDB connection timeout"
**Cause :** IP non autorisée dans MongoDB Atlas  
**Solution :** Ajouter `0.0.0.0/0` dans Network Access

### Erreur : "Invalid token"
**Cause :** Token expiré ou invalide  
**Solution :** Se reconnecter pour obtenir un nouveau token

### Erreur : "Only image files are allowed"
**Cause :** Tentative d'upload d'un fichier non-image  
**Solution :** Upload uniquement des .jpg, .jpeg, .png, .gif

---

## 📝 Bonnes pratiques

### 1. Code
- ✅ Commentaires clairs en français
- ✅ Noms de variables explicites
- ✅ Gestion d'erreurs complète
- ✅ Validation des données

### 2. Sécurité
- ✅ Ne jamais commit .env
- ✅ Utiliser des secrets forts (32+ caractères)
- ✅ Valider toutes les entrées utilisateur
- ✅ Ne jamais retourner les mots de passe

### 3. Git
- ✅ .gitignore pour node_modules/ et .env
- ✅ Commits atomiques avec messages clairs
- ✅ Branches pour les features

---

## 🚀 Évolutions possibles

1. **Notifications par email** (Nodemailer)
2. **Pagination** des résultats
3. **Filtres avancés** (date, montant, statut)
4. **Statistiques** pour les admins
5. **Export PDF** des factures
6. **Authentification Microsoft** (Passport)
7. **Système de commentaires** sur les factures
8. **Historique des modifications**

---

## 📞 Support

Pour toute question ou problème :
1. Vérifier cette documentation
2. Consulter les logs du serveur
3. Utiliser Postman pour tester les routes
4. Vérifier les variables d'environnement

---

**✨ Projet créé avec ❤️ pour GSB**

