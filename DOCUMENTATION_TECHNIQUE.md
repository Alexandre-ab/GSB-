# 📘 Documentation Technique - GSB Gestion de Frais

> **Projet BTS SIO option SLAM**  
> Application de gestion de notes de frais professionnels  
> Version 1.0.0 - Décembre 2025

---

## 📚 Navigation Documentation

| Document | Description |
|----------|-------------|
| [🏠 README](./README.md) | Vue d'ensemble du projet |
| **📘 Documentation Technique** | **Vous êtes ici** |
| [📗 Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) | Guide utilisateur |
| [🚀 Guide d'Installation](./GUIDE_INSTALLATION.md) | Installation pas à pas |
| [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) | Référentiel BTS |

---

## 📋 Table des matières

1. [Contexte du projet](#contexte-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Technologies utilisées](#technologies-utilisées)
4. [Base de données](#base-de-données)
5. [API REST](#api-rest)
6. [Sécurité](#sécurité)
7. [Infrastructure Cloud](#infrastructure-cloud)
8. [Guide de développement](#guide-de-développement)
9. [Tests et qualité](#tests-et-qualité)
10. [Déploiement](#déploiement)

---

## 🎯 Contexte du projet

### Problématique

L'entreprise GSB (Galaxy Swiss Bourdin) a besoin d'une solution moderne pour gérer les notes de frais de ses employés. Le processus actuel, basé sur des documents papier, est lent et source d'erreurs.

### Objectifs

- ✅ Digitaliser le processus de soumission des notes de frais
- ✅ Faciliter la validation par les managers
- ✅ Réduire les délais de traitement
- ✅ Améliorer la traçabilité et l'archivage
- ✅ Fournir des statistiques en temps réel

### Périmètre fonctionnel

**Pour les employés :**
- Création de notes de frais avec justificatifs
- Suivi de l'état des demandes
- Historique des remboursements

**Pour les administrateurs :**
- Validation/rejet des demandes
- Gestion des utilisateurs
- Tableau de bord statistique
- Export des données

---

## 🏗️ Architecture technique

### Vue d'ensemble

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│   MongoDB       │
│     (Vite)      │  HTTPS  │    REST         │  Atlas  │   Database      │
│                 │         │                 │         │                 │
└────────┬────────┘         └────────┬────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Google OAuth   │         │   AWS S3        │
│  Authentication │         │  File Storage   │
└─────────────────┘         └─────────────────┘
```

### Architecture MVC (Backend)

```
┌──────────────────────────────────────────────────────────────┐
│                          CLIENT HTTP                          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      ROUTES (Router)                          │
│  - authentication_route.js                                    │
│  - user_route.js                                              │
│  - bill_route.js                                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE                                 │
│  - verifyToken (JWT)                                          │
│  - upload (Multer)                                            │
│  - errorHandler                                               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    CONTROLLERS                                │
│  - authentication_controller.js                               │
│  - user_controller.js                                         │
│  - bill_controller.js                                         │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      MODELS (Mongoose)                        │
│  - user_model.js                                              │
│  - bill_model.js                                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                           │
└──────────────────────────────────────────────────────────────┘
```

### Architecture Frontend (React)

```
┌──────────────────────────────────────────────────────────────┐
│                        main.jsx                               │
│                    (Point d'entrée)                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                        App.jsx                                │
│                   (React Router)                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Auth      │    │   Layout     │    │   Pages      │
│  Components  │    │  Components  │    │  Components  │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ - LoginPage  │    │ - MainLayout │    │ - Dashboard  │
│ - SignIn     │    │ - Header     │    │ - Profile    │
│ - Callback   │    │              │    │ - Demandes   │
└──────────────┘    └──────────────┘    │ - Admin      │
                                        │ - Parametres │
                                        └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   Services   │
                    ├──────────────┤
                    │ - authService│
                    │ - billService│
                    │ - userService│
                    │ - statsService│
                    └──────────────┘
```

---

## 💻 Technologies utilisées

### Backend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **Node.js** | ≥ 18.0.0 | Runtime JavaScript |
| **Express.js** | 4.18.2 | Framework web |
| **MongoDB** | 8.13.2 | Base de données NoSQL |
| **Mongoose** | 8.13.2 | ODM MongoDB |
| **JWT** | 9.0.2 | Authentification stateless |
| **Passport.js** | 0.7.0 | Stratégie OAuth |
| **Multer** | 1.4.5 | Upload de fichiers |
| **AWS SDK** | 2.1692.0 | Intégration S3 |
| **SHA-256** | 0.11.0 | Hashing des mots de passe |
| **CORS** | 2.8.5 | Gestion des requêtes cross-origin |

### Frontend

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| **React** | 19.1.0 | Framework UI |
| **Vite** | 6.3.5 | Build tool moderne |
| **React Router** | 7.6.0 | Routing côté client |
| **ESLint** | 9.25.0 | Linter JavaScript |

### Infrastructure

| Service | Utilisation |
|---------|-------------|
| **MongoDB Atlas** | Base de données cloud |
| **AWS S3** | Stockage des justificatifs |
| **Render** | Hébergement backend |
| **Vercel/Netlify** | Hébergement frontend |

---

## 🗄️ Base de données

### Modèle de données

#### Collection `users`

```javascript
{
  _id: ObjectId,
  name: String,              // Nom complet de l'utilisateur
  email: String,             // Email (unique, index)
  password: String,          // Hash SHA-256 + SALT
  role: String,              // "user" | "admin"
  type_sso: String,          // "local" | "google" | "microsoft"
  external_id: String,       // ID externe pour SSO (optionnel)
  createdAt: Date,           // Date de création
  __v: Number                // Version Mongoose
}
```

**Contraintes :**
- `email` : unique, requis
- `password` : requis pour type_sso="local"
- `role` : valeurs autorisées ["user", "admin"]

**Index :**
```javascript
{ email: 1 }  // Index unique
```

#### Collection `bills`

```javascript
{
  _id: ObjectId,
  date: String,              // Date de la dépense (format YYYY-MM-DD)
  amount: Number,            // Montant en euros
  proof: String,             // URL du justificatif S3
  description: String,       // Description de la dépense
  status: String,            // "pending" | "approved" | "rejected"
  type: String,              // Type de frais (repas, transport, hébergement...)
  user: ObjectId,            // Référence vers users._id
  createdAt: String,         // Date de création ISO
  __v: Number
}
```

**Contraintes :**
- `user` : référence obligatoire vers `users`
- `status` : valeurs autorisées ["pending", "approved", "rejected"]
- `amount` : nombre positif

**Relations :**
```javascript
Bill.user → User._id  (Many-to-One)
```

### Schémas Mongoose

#### UserSchema

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"]
    },
    password: {
      type: String,
      required: function() {
        return this.type_sso === "local";
      }
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    type_sso: {
      type: String,
      enum: ["local", "google", "microsoft"],
      default: "local"
    },
    external_id: {
      type: String,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

// Hook pre-save : Hashing automatique du mot de passe
userSchema.pre("save", async function(next) {
  if (this.isModified("password") && this.type_sso === "local") {
    this.password = sha256(this.password + process.env.SALT);
  }
  next();
});
```

#### BillSchema

```javascript
const billSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "La date est requise"]
    },
    amount: {
      type: Number,
      required: [true, "Le montant est requis"],
      min: [0, "Le montant doit être positif"]
    },
    proof: {
      type: String,
      required: [true, "Le justificatif est requis"]
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    type: {
      type: String,
      required: [true, "Le type de frais est requis"]
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString()
    }
  }
);
```

### Requêtes courantes

#### Récupérer toutes les factures d'un utilisateur
```javascript
const bills = await Bill.find({ user: userId })
  .populate("user", "name email")
  .sort({ createdAt: -1 });
```

#### Statistiques par statut
```javascript
const stats = await Bill.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  { 
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      total: { $sum: "$amount" }
    }
  }
]);
```

---

## 🔌 API REST

### Convention de nommage

- **Base URL** : `http://localhost:5000` (dev) ou `https://api.gsb.com` (prod)
- **Format** : JSON
- **Encodage** : UTF-8
- **Authentification** : Bearer Token (JWT)

### Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant/invalide |
| 403 | Forbidden - Accès refusé |
| 404 | Not Found - Ressource introuvable |
| 500 | Internal Server Error - Erreur serveur |

### Routes d'authentification

#### POST /api/users - Créer un compte

**Description** : Inscription d'un nouvel utilisateur

**Body :**
```json
{
  "name": "Alice Martin",
  "email": "alice@example.com",
  "password": "motdepasse123",
  "role": "user"
}
```

**Réponse 201 :**
```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Martin",
    "email": "alice@example.com",
    "role": "user",
    "type_sso": "local",
    "createdAt": "2025-12-09T10:30:00.000Z"
  }
}
```

**Erreurs possibles :**
- 400 : Email déjà utilisé
- 400 : Données manquantes

---

#### POST /api/auth/login - Se connecter

**Description** : Authentification locale avec email/password

**Body :**
```json
{
  "email": "alice@example.com",
  "password": "motdepasse123"
}
```

**Réponse 200 :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Martin",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

**Erreurs possibles :**
- 400 : Email ou mot de passe incorrect
- 400 : Utilisateur inexistant

---

#### GET /auth/google - Authentification Google OAuth

**Description** : Redirection vers Google pour authentification

**Réponse** : Redirect vers Google OAuth

---

#### GET /auth/google/callback - Callback OAuth

**Description** : Traite la réponse de Google et crée/connecte l'utilisateur

**Query params :**
- `code` : Authorization code de Google

**Réponse** : Redirect vers frontend avec token en query param

---

### Routes utilisateurs (protégées)

**Authentification requise** : Toutes les routes nécessitent le header :
```
Authorization: Bearer <JWT_TOKEN>
```

#### GET /api/users - Liste des utilisateurs

**Description** : Récupère tous les utilisateurs (admin uniquement)

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Martin",
    "email": "alice@example.com",
    "role": "user",
    "createdAt": "2025-12-09T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Bob Dupont",
    "email": "bob@example.com",
    "role": "admin",
    "createdAt": "2025-12-08T14:20:00.000Z"
  }
]
```

**Erreurs possibles :**
- 401 : Token invalide
- 403 : Accès réservé aux admins

---

#### PUT /api/users?email={email} - Modifier un utilisateur

**Description** : Mise à jour des informations utilisateur

**Headers :**
```
Authorization: Bearer <token>
```

**Query params :**
- `email` : Email de l'utilisateur à modifier

**Body :**
```json
{
  "name": "Alice Martin-Dupont",
  "role": "admin"
}
```

**Réponse 200 :**
```json
{
  "message": "Utilisateur mis à jour",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Martin-Dupont",
    "email": "alice@example.com",
    "role": "admin"
  }
}
```

---

#### DELETE /api/users?email={email} - Supprimer un utilisateur

**Description** : Suppression d'un utilisateur (admin uniquement)

**Headers :**
```
Authorization: Bearer <token>
```

**Query params :**
- `email` : Email de l'utilisateur à supprimer

**Réponse 200 :**
```json
{
  "message": "Utilisateur supprimé avec succès"
}
```

---

### Routes factures (protégées)

#### POST /api/bills - Créer une facture

**Description** : Création d'une nouvelle note de frais avec justificatif

**Headers :**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form-data :**
```
date: "2025-12-09"
amount: 125.50
description: "Repas client restaurant Le Gourmet"
type: "repas"
proof: [fichier image/pdf]
```

**Réponse 201 :**
```json
{
  "message": "Facture créée avec succès",
  "bill": {
    "_id": "507f1f77bcf86cd799439020",
    "date": "2025-12-09",
    "amount": 125.50,
    "proof": "https://gsb-bucket.s3.eu-west-1.amazonaws.com/bills/1733743800000-receipt.jpg",
    "description": "Repas client restaurant Le Gourmet",
    "status": "pending",
    "type": "repas",
    "user": "507f1f77bcf86cd799439011",
    "createdAt": "2025-12-09T10:30:00.000Z"
  }
}
```

**Erreurs possibles :**
- 400 : Fichier manquant
- 400 : Données invalides
- 413 : Fichier trop volumineux (> 5MB)

---

#### GET /api/bills - Liste des factures

**Description** : 
- Admin : récupère toutes les factures
- User : récupère uniquement ses factures

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "date": "2025-12-09",
    "amount": 125.50,
    "proof": "https://...",
    "description": "Repas client",
    "status": "pending",
    "type": "repas",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Alice Martin",
      "email": "alice@example.com"
    },
    "createdAt": "2025-12-09T10:30:00.000Z"
  }
]
```

---

#### PUT /api/bills/:id - Modifier une facture

**Description** : Mise à jour d'une facture (statut, montant, description...)

**Headers :**
```
Authorization: Bearer <token>
```

**Params :**
- `id` : ID de la facture

**Body :**
```json
{
  "status": "approved",
  "description": "Repas client - Validé par manager"
}
```

**Réponse 200 :**
```json
{
  "message": "Facture mise à jour",
  "bill": {
    "_id": "507f1f77bcf86cd799439020",
    "status": "approved",
    "description": "Repas client - Validé par manager",
    ...
  }
}
```

---

#### DELETE /api/bills/:id - Supprimer une facture

**Description** : Suppression d'une facture et de son justificatif S3

**Headers :**
```
Authorization: Bearer <token>
```

**Params :**
- `id` : ID de la facture

**Réponse 200 :**
```json
{
  "message": "Facture supprimée avec succès"
}
```

---

## 🔐 Sécurité

### Authentification JWT

#### Génération du token

```javascript
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
};
```

#### Vérification du token (Middleware)

```javascript
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Ajoute les infos user à la requête
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
};
```

### Hashing des mots de passe

**Algorithme** : SHA-256 avec SALT

```javascript
const { sha256 } = require("js-sha256");

// À l'inscription
const hashedPassword = sha256(plainPassword + process.env.SALT);

// À la connexion (comparaison)
const inputHash = sha256(inputPassword + process.env.SALT);
const isValid = inputHash === user.password;
```

**Note** : Le SALT doit être une chaîne aléatoire d'au moins 32 caractères, stockée dans `.env`.

### Google OAuth 2.0

#### Configuration Passport

```javascript
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Recherche ou création de l'utilisateur
        let user = await User.findOne({ external_id: profile.id });
        
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            type_sso: "google",
            external_id: profile.id,
            role: "user"
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
```

### CORS (Cross-Origin Resource Sharing)

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);
```

### Validation des uploads

```javascript
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Type de fichier non autorisé"));
    }
  }
});
```

### Variables d'environnement sensibles

**Fichier `.env` (JAMAIS commité sur Git) :**

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gsb

# Sécurité
SALT=votre_salt_aleatoire_minimum_32_caracteres
JWT_SECRET=votre_jwt_secret_minimum_32_caracteres
SESSION_SECRET=votre_session_secret

# AWS S3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=eu-west-1
AWS_BUCKET_NAME=gsb-bucket

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Serveur
PORT=5000
NODE_ENV=development
```

---

## ☁️ Infrastructure Cloud

### AWS S3 - Stockage des justificatifs

#### Configuration

```javascript
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
```

#### Upload d'un fichier

```javascript
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `bills/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read"  // Accessible publiquement
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;  // URL du fichier
};
```

#### Suppression d'un fichier

```javascript
const deleteFromS3 = async (fileUrl) => {
  const key = fileUrl.split(".amazonaws.com/")[1];
  
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };
  
  await s3.deleteObject(params).promise();
};
```

### MongoDB Atlas

#### Configuration

```javascript
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connecté"))
.catch((err) => console.error("❌ Erreur MongoDB:", err));
```

#### Sécurité MongoDB

- ✅ Whitelist IP : `0.0.0.0/0` (production : IP du serveur uniquement)
- ✅ Utilisateur dédié avec permissions limitées
- ✅ Connexion SSL/TLS automatique

---

## 🛠️ Guide de développement

### Installation locale

#### Prérequis

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- Compte MongoDB Atlas
- Compte AWS (S3)

#### Étapes

```bash
# 1. Cloner le projet
git clone <url-repo>
cd GSB-

# 2. Installer les dépendances backend
cd back-end
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Démarrer le backend
npm run dev

# 5. Dans un nouveau terminal - installer frontend
cd ../front-end
npm install

# 6. Démarrer le frontend
npm run dev
```

### Structure du code

#### Backend

```
back-end/
├── api/
│   └── services/
│       └── authGoogle.js         # Stratégie Passport Google
├── config/                        # Configurations (à créer)
├── controllers/                   # Logique métier
│   ├── authentication_controller.js
│   ├── user_controller.js
│   └── bill_controller.js
├── middleware/                    # Middlewares Express
│   └── upload.js                  # Configuration Multer
├── models/                        # Schémas Mongoose
│   ├── user_model.js
│   └── bill_model.js
├── routes/                        # Définition des routes
│   ├── authentication_route.js
│   ├── user_route.js
│   └── bill_route.js
├── utils/                         # Utilitaires
│   └── s3.js                      # Fonctions S3
├── index.js                       # Point d'entrée
├── package.json
└── .env                           # Variables d'environnement
```

#### Frontend

```
front-end/
├── public/
│   └── vite.svg
├── src/
│   ├── api/                       # Configuration API
│   │   ├── config.js
│   │   ├── index.js
│   │   └── services/              # Services HTTP
│   │       ├── authService.js
│   │       ├── billService.js
│   │       ├── statsService.js
│   │       └── userService.js
│   ├── assets/                    # Images, logos
│   │   └── logo.png
│   ├── components/                # Composants React
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Demandes/
│   │   ├── Layout/
│   │   ├── Modal/
│   │   ├── Parametres/
│   │   ├── Profile/
│   │   └── Remboursement/
│   ├── App.jsx                    # Composant principal + Router
│   ├── App.css
│   ├── main.jsx                   # Point d'entrée
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

### Conventions de code

#### JavaScript/React

```javascript
// ✅ Bon - Nommage clair et cohérent
const getUserById = async (userId) => {
  return await User.findById(userId);
};

// ❌ Mauvais - Nommage peu clair
const get = async (id) => {
  return await User.findById(id);
};
```

#### Composants React

```javascript
// ✅ Bon - Composant fonctionnel avec hooks
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const [bills, setBills] = useState([]);
  
  useEffect(() => {
    fetchBills();
  }, []);
  
  return <div>{/* JSX */}</div>;
};

export default DashboardPage;
```

#### Gestion des erreurs

```javascript
// ✅ Bon - Try-catch avec message explicite
try {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }
  res.json(user);
} catch (error) {
  console.error("Erreur récupération utilisateur:", error);
  res.status(500).json({ error: "Erreur serveur" });
}
```

---

## 🧪 Tests et qualité

### Tests à implémenter

#### Tests unitaires (Backend)

```javascript
// Exemple avec Jest/Mocha
describe("User Controller", () => {
  it("devrait créer un utilisateur", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "user"
    };
    
    const response = await request(app)
      .post("/api/users")
      .send(userData)
      .expect(201);
    
    expect(response.body.user.email).toBe(userData.email);
  });
});
```

#### Tests d'intégration

- ✅ Scénario complet : Inscription → Connexion → Création facture → Validation
- ✅ Test des middlewares (JWT, upload)
- ✅ Test des routes protégées

#### Tests frontend (React Testing Library)

```javascript
import { render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";

test("affiche le formulaire de connexion", () => {
  render(<LoginPage />);
  const emailInput = screen.getByPlaceholderText(/email/i);
  expect(emailInput).toBeInTheDocument();
});
```

### Linting

```bash
# Backend
npx eslint .

# Frontend
npm run lint
```

### Outils de qualité

- **ESLint** : Analyse statique du code
- **Prettier** : Formatage automatique
- **Postman** : Tests API manuels
- **MongoDB Compass** : Exploration de la base

---

## 🚀 Déploiement

### Backend (Render)

#### Étapes

1. **Créer un compte Render** : https://render.com

2. **Nouveau Web Service**
   - Repository : Connecter le repo GitHub
   - Branch : `main`
   - Root Directory : `back-end`
   - Environment : `Node`
   - Build Command : `npm install`
   - Start Command : `npm start`

3. **Variables d'environnement** (Dashboard Render)
   ```
   MONGO_URI=mongodb+srv://...
   SALT=...
   JWT_SECRET=...
   SESSION_SECRET=...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=eu-west-1
   AWS_BUCKET_NAME=gsb-bucket
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALLBACK_URL=https://gsb-api.onrender.com/auth/google/callback
   FRONTEND_URL=https://gsb-app.vercel.app
   NODE_ENV=production
   PORT=5000
   ```

4. **Déployer** : Cliquer sur "Create Web Service"

#### URL de production
```
https://gsb-api.onrender.com
```

### Frontend (Vercel/Netlify)

#### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd front-end
vercel --prod
```

#### Configuration

**vercel.json** :
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Variables d'environnement (Vercel Dashboard)

```
VITE_API_URL=https://gsb-api.onrender.com
```

### Checklist de déploiement

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel/Netlify
- [ ] Variables d'environnement configurées
- [ ] MongoDB Atlas accessible depuis Render IP
- [ ] S3 bucket créé et configuré
- [ ] Google OAuth callback URL mis à jour
- [ ] CORS configuré avec l'URL frontend production
- [ ] Tests manuels sur production
- [ ] Monitoring activé (Render Dashboard)

---

## 📊 Monitoring et maintenance

### Logs

#### Backend (Render)

- Accès aux logs : Dashboard Render → Service → Logs
- Logs temps réel disponibles

#### Commandes utiles

```bash
# Tester la connexion MongoDB
mongosh "mongodb+srv://..."

# Lister les objets S3
aws s3 ls s3://gsb-bucket/bills/

# Tester une route
curl -X GET https://gsb-api.onrender.com/api/users \
  -H "Authorization: Bearer <token>"
```

### Performance

#### Optimisations possibles

- [ ] Ajouter un cache Redis pour les tokens JWT
- [ ] Implémenter la pagination sur `/api/bills`
- [ ] Compresser les images avant upload S3
- [ ] Ajouter un CDN pour les assets statiques
- [ ] Indexer les champs fréquemment recherchés

---

## 📚 Ressources

### Documentation du projet

- [🏠 README](./README.md) - Vue d'ensemble et démarrage rapide
- [📗 Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) - Guide utilisateur et admin
- [🚀 Guide d'Installation](./GUIDE_INSTALLATION.md) - Installation complète avec MongoDB Atlas, AWS S3
- [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) - Détail de toutes les compétences avec exemples de code

### Documentation officielle externe

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Mongoose](https://mongoosejs.com/)
- [AWS S3](https://docs.aws.amazon.com/s3/)
- [Passport.js](https://www.passportjs.org/)

### Outils

- [Postman](https://www.postman.com/) - Tests API
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI MongoDB
- [AWS Console](https://aws.amazon.com/console/) - Gestion S3

---

## 🎓 Compétences BTS SIO SLAM

Ce projet couvre les compétences suivantes :

> 💡 **Pour plus de détails**, consultez le [document dédié aux compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) qui inclut :
> - Preuves détaillées pour chaque compétence
> - Exemples de code commentés
> - Diagrammes UML
> - Scénarios de tests

| Code | Compétence | Mise en œuvre |
|------|------------|---------------|
| **B1.1** | Participer à un projet | Architecture MVC, versionning Git |
| **B1.2** | Analyser les besoins | Cahier des charges GSB |
| **B1.3** | Concevoir une solution | Diagrammes UML, modèle de données |
| **B2.1** | Développer une application | Backend Express + Frontend React |
| **B2.2** | Gérer les données | MongoDB, CRUD complet |
| **B2.3** | Sécuriser les applications | JWT, SHA-256, validation inputs |
| **B3.1** | Déployer une application | Render, Vercel, MongoDB Atlas |
| **B3.2** | Maintenir une application | Logs, monitoring, corrections bugs |

---

## 📝 Changelog

### Version 1.0.0 (Décembre 2025)

- ✅ Authentification JWT + Google OAuth
- ✅ CRUD complet utilisateurs
- ✅ CRUD complet factures
- ✅ Upload S3 des justificatifs
- ✅ Interface admin de validation
- ✅ Dashboard statistiques
- ✅ Design responsive

### Améliorations futures

- [ ] Export PDF des factures
- [ ] Notifications email
- [ ] Workflow de validation multi-niveaux
- [ ] API REST paginée
- [ ] Tests automatisés (Jest, Cypress)
- [ ] Mode sombre
- [ ] PWA (Progressive Web App)

---

**📧 Contact** : [Votre email]  
**🔗 Repository** : [URL GitHub]  
**📅 Date** : Décembre 2025

---

*Document réalisé dans le cadre du BTS SIO option SLAM*

