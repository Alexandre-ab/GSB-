# 🏢 GSB - Gestion de Frais Professionnels

Application full-stack de gestion de notes de frais avec authentification JWT et Google OAuth.

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.0.0
- MongoDB Atlas account
- AWS S3 bucket (pour les justificatifs)
- Google OAuth credentials (optionnel)

### Installation

1. **Cloner le projet**
```bash
git clone <url-du-repo>
cd GSB-
```

2. **Backend - Installation**
```bash
cd back-end
npm install
```

3. **Configuration - Créer .env**
```bash
cp .env.example .env
```

Éditer `.env` avec vos valeurs :
```env
MONGO_URI=mongodb+srv://...
SALT=votre_salt_minimum_32_caracteres
JWT_SECRET=votre_jwt_secret_minimum_32_caracteres
SESSION_SECRET=votre_session_secret
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=gsb-bucket
PORT=5000
NODE_ENV=development
```

4. **Démarrer le serveur**
```bash
npm run dev    # Mode développement avec nodemon
# ou
npm start      # Mode production
```

Le serveur démarre sur `http://localhost:5000` 🎉

---

## 📚 Documentation complète

Consultez [DOCUMENTATION.md](./DOCUMENTATION.md) pour :
- Architecture détaillée
- Toutes les routes API avec exemples
- Modèles de données
- Système d'authentification
- Guide de déploiement
- Résolution de problèmes

---

## 🛣️ Routes API principales

### Authentification
```bash
# Créer un compte
POST /api/users
Body: { name, email, password, role }

# Se connecter
POST /api/auth/login
Body: { email, password }
→ Retourne un JWT

# Google OAuth
GET /auth/google
```

### Utilisateurs (protégé par JWT)
```bash
# Récupérer tous les utilisateurs
GET /api/users
Header: Authorization: Bearer <token>

# Mettre à jour un utilisateur
PUT /api/users?email=user@example.com
Header: Authorization: Bearer <token>

# Supprimer un utilisateur
DELETE /api/users?email=user@example.com
Header: Authorization: Bearer <token>
```

### Factures (protégé par JWT)
```bash
# Créer une facture
POST /api/bills
Header: Authorization: Bearer <token>
Body: multipart/form-data (metadata + fichier image)

# Récupérer les factures
GET /api/bills
Header: Authorization: Bearer <token>
→ Admin voit toutes les factures
→ User voit uniquement ses factures

# Mettre à jour une facture
PUT /api/bills/:id
Header: Authorization: Bearer <token>

# Supprimer une facture
DELETE /api/bills/:id
Header: Authorization: Bearer <token>
```

---

## 🧪 Tester avec Postman

### 1. Créer un utilisateur
```http
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "name": "Alice Martin",
  "email": "alice@example.com",
  "password": "motdepasse123",
  "role": "user"
}
```

### 2. Se connecter
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "motdepasse123"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Utiliser le token
Pour toutes les routes protégées, ajouter le header :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Structure des données

### User
```javascript
{
  name: String,              // Nom complet
  email: String,             // Email unique
  password: String,          // Hashé avec SHA-256
  role: String,              // "user" ou "admin"
  type_sso: String,          // "local", "google", "microsoft"
  external_id: String,       // Pour OAuth
  createdAt: Date
}
```

### Bill (Facture)
```javascript
{
  date: String,              // Date de la dépense
  amount: Number,            // Montant
  proof: String,             // URL du justificatif (S3)
  description: String,       // Description
  status: String,            // "pending", "approved", "rejected"
  type: String,              // Type de frais
  user: ObjectId,            // Référence vers User
  createdAt: String
}
```

---

## 📁 Structure du projet

```
back-end/
├── controllers/           # Logique métier
│   ├── authentication_controller.js
│   ├── user_controller.js
│   └── bill_controller.js
├── models/               # Schémas MongoDB
│   ├── user_model.js
│   └── bill_model.js
├── routes/               # Routes API
│   ├── authentication_route.js
│   ├── user_route.js
│   └── bill_route.js
├── middleware/           # Middlewares Express
│   └── upload.js
├── api/services/         # Services externes
│   └── authGoogle.js
├── utils/                # Utilitaires
│   └── s3.js
├── index.js              # Point d'entrée
├── package.json
└── .env                  # Variables d'environnement
```

---

## 🔐 Sécurité

- ✅ Mots de passe hashés avec **SHA-256 + SALT**
- ✅ Authentification **JWT** (expire après 24h)
- ✅ Middleware de vérification de token
- ✅ Rôles utilisateur (user/admin)
- ✅ Upload sécurisé (taille limitée, types vérifiés)
- ✅ CORS configuré

---

## 🚀 Déploiement sur Render

### Backend

1. **Créer un Web Service sur Render**

2. **Build Command :**
```bash
npm install
```

3. **Start Command :**
```bash
npm start
```

4. **Variables d'environnement à configurer :**
- `MONGO_URI`
- `SALT`
- `JWT_SECRET`
- `SESSION_SECRET`
- `FRONTEND_URL`
- `GOOGLE_CALLBACK_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`
- `NODE_ENV=production`

---

## 🛠️ Technologies utilisées

### Backend
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Base de données
- **JWT** - Authentification
- **Passport.js** - Google OAuth
- **Multer** - Upload de fichiers
- **AWS SDK** - Stockage S3
- **SHA-256** - Hashing

### Frontend
- **React** - Interface utilisateur
- **Vite** - Build tool
- **React Router** - Navigation

---

## 🐛 Résolution de problèmes

### MongoDB connection error
- Vérifier que votre IP est autorisée dans MongoDB Atlas
- Ajouter `0.0.0.0/0` dans Network Access

### SALT is not defined
- Ajouter `SALT=votre_salt_secret` dans `.env`

### Invalid token
- Token expiré → Se reconnecter
- Token mal formé → Vérifier le format `Bearer <token>`

---

## 📝 Scripts disponibles

```bash
npm start       # Démarrer en production
npm run dev     # Démarrer en développement (nodemon)
npm test        # Lancer les tests (à implémenter)
```

---

## 🎓 Concepts clés

### Architecture MVC
- **Models** : Définition des données (Mongoose)
- **Views** : Interface React
- **Controllers** : Logique métier

### Middleware Express
```javascript
router.get('/api/bills', verifyToken, getBills)
//                       ↑ vérifie JWT avant d'exécuter getBills
```

### Hook Mongoose
```javascript
userSchema.pre('save', async function(next) {
  // S'exécute automatiquement avant chaque sauvegarde
  this.password = sha256(this.password + SALT)
})
```

---

## 📞 Support

- 📖 Lire [DOCUMENTATION.md](./DOCUMENTATION.md)
- 🐛 Vérifier les logs du serveur
- 🧪 Tester avec Postman
- ⚙️ Vérifier les variables d'environnement

---

## 📄 Licence

ISC

---

**✨ Projet GSB - Gestion de Frais Professionnels**

