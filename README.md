# 🏢 GSB - Gestion des Notes de Frais

Application full-stack de gestion de notes de frais des visiteurs médicaux du laboratoire Galaxy Swiss Bourdin (GSB), avec authentification JWT et Google OAuth.

> **Contexte** : refonte de l'ancienne application desktop C# (non accessible hors réseau local) vers une solution Web accessible depuis n'importe quel navigateur. Projet pédagogique — BTS SIO option SLAM, session 2026.

---

## 🌐 Démo en ligne (recommandé pour le jury)

L'application est déployée et testable immédiatement, sans installation :

| Service | URL |
|---------|-----|
| **Frontend** | [https://gsb-black.vercel.app](https://gsb-black.vercel.app) |
| **API Backend** | [https://gsb-2.onrender.com](https://gsb-2.onrender.com) |

> ⚠️ Le backend Render peut prendre 30 à 60 secondes de réveil au premier appel (instance gratuite).

### 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| **User** (visiteur médical) | alice@example.com | `motdepasse123` |
| **Admin** (comptable) | admin@gsb.fr | `Admin123!` |

---

## 📚 Navigation Documentation

> **🎯 Nouveau !** La documentation complète est organisée pour une navigation facile :

| 🗺️ Navigation | Description |
|--------------|-------------|
| **[📚 INDEX DOCUMENTATION](./INDEX_DOCUMENTATION.md)** | **Point d'entrée principal** - Navigation complète par besoin |
| [🔗 Liens Rapides](./LIENS_RAPIDES.md) | Accès direct aux sections les plus consultées |
| [🗺️ Structure Documentation](./STRUCTURE_DOCUMENTATION.md) | Vue architecturale et parcours recommandés |

### 📖 Documents principaux

| Document | Pour qui ? | Contenu |
|----------|------------|---------|
| [📘 Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) | 👨‍💻 Développeurs | Architecture, API REST, Base de données, Sécurité |
| [📗 Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) | 👤 Utilisateurs | Guide complet d'utilisation, FAQ |
| [🚀 Guide d'Installation](./GUIDE_INSTALLATION.md) | 🔧 Installation | Installation pas à pas, Troubleshooting |
| [🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) | 🎓 Étudiants/Jury | Référentiel complet avec preuves |

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.0.0
- MongoDB Atlas account (ou MongoDB local)
- AWS S3 bucket (pour les justificatifs)
- Google OAuth credentials (optionnel)

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/Alexandre-ab/GSB-.git
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

4. **Démarrer le backend**
```bash
npm run dev    # Mode développement avec nodemon
# ou
npm start      # Mode production
```

Le serveur démarre sur `http://localhost:5000` 🎉

5. **Frontend - Installation**
```bash
cd front-end
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173` 🎉

---

## 📚 Documentation complète

Ce projet dispose d'une documentation exhaustive répartie en plusieurs fichiers :

### 📖 Documentation principale

- **[📘 Documentation Technique](./DOCUMENTATION_TECHNIQUE.md)** - Architecture, API REST, base de données, sécurité
- **[📗 Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md)** - Guide utilisateur et administrateur
- **[🚀 Guide d'Installation](./GUIDE_INSTALLATION.md)** - Installation pas à pas (dev + production)
- **[🎓 Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md)** - Mapping du référentiel BTS SIO

### 🎯 Accès rapide

| Besoin | Document |
|--------|----------|
| Installer le projet | [Guide d'Installation](./GUIDE_INSTALLATION.md) |
| Comprendre l'architecture | [Documentation Technique](./DOCUMENTATION_TECHNIQUE.md#architecture-technique) |
| Utiliser l'application | [Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) |
| Préparer le BTS | [Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) |
| Consulter l'API | [Documentation Technique - API REST](./DOCUMENTATION_TECHNIQUE.md#api-rest) |
| Résoudre un problème | [Guide d'Installation - Troubleshooting](./GUIDE_INSTALLATION.md#résolution-de-problèmes) |

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

### Notes de frais (protégé par JWT)
```bash
# Créer une note de frais
POST /api/bills
Header: Authorization: Bearer <token>
Body: multipart/form-data (metadata + fichier justificatif)

# Récupérer les notes de frais
GET /api/bills
Header: Authorization: Bearer <token>
→ Admin voit toutes les notes
→ User voit uniquement ses notes

# Mettre à jour une note de frais
PUT /api/bills/:id
Header: Authorization: Bearer <token>

# Supprimer une note de frais
DELETE /api/bills/:id
Header: Authorization: Bearer <token>
```

---

## 🧪 Tester avec Postman

### 1. Se connecter avec un compte de test
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

### 2. Utiliser le token
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
  password: String,          // Hashé avec SHA-256 + salt
  role: String,              // "user" ou "admin"
  type_sso: String,          // "local", "google", "microsoft"
  external_id: String,       // Pour OAuth
  createdAt: Date
}
```

### Bill (Note de frais)
```javascript
{
  date: String,              // Date de la dépense
  amount: Number,            // Montant
  proof: String,             // URL du justificatif (S3)
  description: String,       // Description
  status: String,            // "pending", "approved", "rejected"
  type: String,              // Type de frais
  user: ObjectId,            // Référence vers User (userId)
  createdAt: String
}
```

> Le schéma Bill contient un champ `user` (ObjectId, ref: User) permettant de rattacher chaque note de frais à son auteur. Côté API, la route GET /api/bills filtre les notes par userId pour les visiteurs, ou retourne l'ensemble des notes pour l'administrateur.

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

front-end/
├── src/
│   ├── components/       # Composants React (dont AdminRoute)
│   ├── pages/            # Pages de l'application
│   └── App.jsx           # Router principal
├── package.json
└── vite.config.js
```

---

## 🔐 Sécurité

- ✅ Mots de passe hashés avec **SHA-256 + salt** côté serveur
- ✅ Authentification **JWT** (token signé, expire après 24h)
- ✅ **Google OAuth** via Passport.js
- ✅ Middleware de vérification de token
- ✅ **Middleware admin** sur les routes sensibles (POST /api/users)
- ✅ Composant **AdminRoute** côté React (vérification isAdmin())
- ✅ **CORS restrictif** (seul le frontend autorisé)
- ✅ Variables d'environnement pour les credentials (suppression du hardcoding)
- ✅ Upload sécurisé (taille limitée, types vérifiés)
- ✅ Fichier **.env.example** documentant toutes les variables nécessaires

> **Note :** le choix de SHA-256 + salt (vs bcrypt) est un choix technique assumé et documenté. SHA-256 + salt offre une protection de base ; bcrypt serait préférable en production pour sa résistance au brute-force.

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
- **MongoDB** + **Mongoose** - Base de données (MongoDB Atlas)
- **JWT** - Authentification stateless
- **Passport.js** - Google OAuth
- **Multer** - Upload de fichiers
- **AWS SDK** - Stockage S3
- **SHA-256 + salt** - Hashing des mots de passe

### Frontend
- **React** + **Vite** - Interface utilisateur (SPA)
- **React Router** - Navigation
- **Hooks** (useState, useEffect) - Gestion d'état

### Déploiement
- **Vercel** - Frontend
- **Render** - Backend API

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

### API Render ne répond pas
- L'instance gratuite se met en veille après inactivité
- Patienter 30 à 60 secondes au premier appel, puis réessayer

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

### Documentation

- 📘 [Documentation Technique](./DOCUMENTATION_TECHNIQUE.md) - Détails techniques complets
- 📗 [Documentation Fonctionnelle](./DOCUMENTATION_FONCTIONNELLE.md) - Guide utilisateur
- 🚀 [Guide d'Installation](./GUIDE_INSTALLATION.md) - Installation et déploiement
- 🎓 [Compétences BTS SLAM](./COMPETENCES_BTS_SLAM.md) - Référentiel BTS

### Outils de diagnostic

- 🐛 Vérifier les logs du serveur
- 🧪 Tester avec Postman ([Collection disponible](./GSB_Postman_Collection.json))
- ⚙️ Vérifier les variables d'environnement
- 🔍 Consulter le [Guide de résolution de problèmes](./GUIDE_INSTALLATION.md#résolution-de-problèmes)

---

## 📄 Licence

ISC

---

**✨ Projet GSB - Gestion des Notes de Frais — Alexandre Boué — BTS SIO SLAM 2026**
