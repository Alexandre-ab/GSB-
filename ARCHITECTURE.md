# 🏗️ Architecture - Projet GSB

Documentation de l'architecture technique du projet GSB.

---

## 📊 Vue d'ensemble

GSB est une application full-stack basée sur l'architecture **MVC (Model-View-Controller)** avec une séparation claire entre le frontend et le backend.

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│                Interface utilisateur                 │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/REST API
                       ↓
┌─────────────────────────────────────────────────────┐
│               BACKEND (Node.js/Express)              │
│                      API REST                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  Routes    │→ │Controllers │→ │   Models   │   │
│  └────────────┘  └────────────┘  └────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose ORM
                       ↓
┌─────────────────────────────────────────────────────┐
│              MONGODB (Base de données)               │
│              Collections: users, bills               │
└─────────────────────────────────────────────────────┘
                       
        ┌─────────────────────┬──────────────────┐
        ↓                     ↓                  ↓
┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│   AWS S3     │    │   Google     │   │     JWT      │
│  (Fichiers)  │    │    OAuth     │   │  (Auth)      │
└──────────────┘    └──────────────┘   └──────────────┘
```

---

## 🎯 Pattern MVC

### Model (Modèles de données)

**Responsabilité :** Définir la structure des données et les règles métier.

```
back-end/models/
├── user_model.js    # Schéma User + hooks
└── bill_model.js    # Schéma Bill
```

**Exemple - User Model :**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,  // Hashé automatiquement
  role: String
})

// Hook pre-save pour hasher le mot de passe
userSchema.pre('save', async function(next) {
  this.password = sha256(this.password + SALT)
  next()
})
```

### View (Vues)

**Responsabilité :** Afficher les données à l'utilisateur.

Le frontend React agit comme la "View" du pattern MVC.

```
front-end/src/
├── components/      # Composants React
├── pages/           # Pages de l'application
└── api/             # Appels API vers le backend
```

### Controller (Contrôleurs)

**Responsabilité :** Logique métier, traitement des requêtes.

```
back-end/controllers/
├── authentication_controller.js  # Login, JWT, verification
├── user_controller.js           # CRUD utilisateurs
└── bill_controller.js           # CRUD factures
```

**Exemple - User Controller :**
```javascript
const createUser = async (req, res) => {
  // 1. Récupérer les données
  const { name, email, password, role } = req.body
  
  // 2. Créer l'utilisateur
  const user = new User({ name, email, password, role })
  
  // 3. Sauvegarder (le hook pre-save hashera le password)
  await user.save()
  
  // 4. Retourner la réponse
  res.status(201).json(user)
}
```

---

## 🚦 Flux de requête complet

### Exemple : Créer une facture

```
1. CLIENT (React Frontend)
   ↓
   fetch('http://api.com/api/bills', {
     method: 'POST',
     headers: { 
       'Authorization': 'Bearer <JWT>',
       'Content-Type': 'multipart/form-data'
     },
     body: formData
   })

2. SERVEUR EXPRESS (index.js)
   ↓
   app.use('/api/bills', billRoute)
   
3. ROUTER (routes/bill_route.js)
   ↓
   router.post('/', verifyToken, upload.single('proof'), createBill)
   
4. MIDDLEWARE - verifyToken
   ↓
   - Vérifie le JWT
   - Décode le token
   - Ajoute user à req.user
   - next()
   
5. MIDDLEWARE - upload.single('proof')
   ↓
   - Multer intercepte le fichier
   - Vérifie le type (image seulement)
   - Limite la taille (5MB)
   - Stocke en mémoire
   - next()
   
6. CONTROLLER - createBill
   ↓
   - Récupère les données (req.body.metadata)
   - Récupère l'utilisateur (req.user.id)
   - Upload le fichier sur S3 via uploadToS3()
   - Crée l'objet Bill avec l'URL S3
   - Sauvegarde dans MongoDB
   - Retourne la facture créée

7. MONGOOSE → MONGODB
   ↓
   - Insert dans la collection "bills"
   
8. RÉPONSE → CLIENT
   ↓
   {
     _id: "...",
     proof: "https://s3.amazonaws.com/...",
     status: "pending",
     ...
   }
```

---

## 🔐 Système d'authentification

### Architecture à deux niveaux

```
┌─────────────────────────────────────────────────┐
│         AUTHENTIFICATION LOCALE (JWT)            │
│                                                  │
│  1. Inscription                                  │
│     POST /api/users                              │
│     → Mot de passe hashé (SHA-256 + SALT)      │
│     → Stocké dans MongoDB                       │
│                                                  │
│  2. Connexion                                    │
│     POST /api/auth/login                         │
│     → Vérification du hash                      │
│     → Génération d'un JWT                       │
│     → JWT valide 24h                            │
│                                                  │
│  3. Routes protégées                             │
│     Middleware verifyToken                       │
│     → Vérifie le JWT                            │
│     → Décode les infos utilisateur              │
│     → Passe au controller                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│      AUTHENTIFICATION GOOGLE (OAuth 2.0)         │
│                                                  │
│  1. Utilisateur clique "Login with Google"       │
│     GET /auth/google                             │
│     → Redirection vers Google                   │
│                                                  │
│  2. Google authentifie l'utilisateur             │
│     → Demande les permissions                   │
│     → Utilisateur accepte                       │
│                                                  │
│  3. Callback                                     │
│     GET /auth/google/callback?code=...           │
│     → Passport récupère le profil               │
│     → findOrCreateUser() crée/récupère user     │
│     → Génération d'un JWT                       │
│     → Redirection vers frontend + token         │
└─────────────────────────────────────────────────┘
```

### Sécurité des mots de passe

```
Inscription/Login:

Mot de passe clair     SALT (env var)
       ↓                      ↓
       └────────┬─────────────┘
                ↓
           SHA-256 Hash
                ↓
  a3f7b8c9d2e1f4g5h6i7j8k9... (64 caractères)
                ↓
         Stocké en DB


Vérification (login):
Mot de passe fourni → Hash avec SALT → Compare avec DB
```

---

## 📦 Structure des modules

### Backend

```
back-end/
│
├── index.js                    # Point d'entrée
│   ├── Configuration Express
│   ├── Middlewares globaux
│   ├── Connexion MongoDB
│   ├── Routes
│   └── Démarrage serveur
│
├── routes/                     # Définition des routes
│   ├── authentication_route.js
│   ├── user_route.js
│   └── bill_route.js
│
├── controllers/                # Logique métier
│   ├── authentication_controller.js
│   │   ├── login()
│   │   ├── verifyToken()
│   │   └── isAdmin()
│   │
│   ├── user_controller.js
│   │   ├── createUser()
│   │   ├── getUsers()
│   │   ├── getUserByEmail()
│   │   ├── updateUser()
│   │   └── deleteUser()
│   │
│   └── bill_controller.js
│       ├── createBill()
│       ├── getBills()
│       ├── getBillById()
│       ├── updateBill()
│       └── deleteBill()
│
├── models/                     # Schémas Mongoose
│   ├── user_model.js
│   │   ├── userSchema
│   │   ├── Hook pre-save
│   │   ├── User model
│   │   └── findOrCreateUser()
│   │
│   └── bill_model.js
│       ├── billSchema
│       └── Bill model
│
├── middleware/                 # Middlewares custom
│   └── upload.js
│       └── Configuration Multer
│
├── utils/                      # Utilitaires
│   └── s3.js
│       └── uploadToS3()
│
└── api/services/               # Services externes
    └── authGoogle.js
        └── Configuration Passport Google OAuth
```

---

## 🔄 Middlewares

Les middlewares sont des fonctions qui s'exécutent **avant** le controller.

### Ordre d'exécution

```javascript
router.post('/', verifyToken, upload.single('proof'), createBill)
//            ↓        ↓              ↓                   ↓
//         Route   Middleware 1   Middleware 2      Controller

Ordre d'exécution:
1. verifyToken   → Vérifie le JWT
2. upload        → Gère l'upload du fichier
3. createBill    → Traite la requête
```

### Middlewares globaux (index.js)

```javascript
app.use(cors())                    // Autorise les requêtes cross-origin
app.use(express.json())            // Parse le JSON
app.use(express.urlencoded(...))   // Parse les formulaires
app.use(session(...))              // Gère les sessions
app.use(passport.initialize())     // Initialise Passport
app.use(passport.session())        // Gère les sessions Passport
```

### Middlewares de route

```javascript
// verifyToken - Vérifie l'authentification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' })
    req.user = decoded  // Ajoute les infos user à req
    next()              // Passe au middleware suivant
  })
}

// isAdmin - Vérifie le rôle admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin required' })
  }
  next()
}
```

---

## 🗄️ Base de données MongoDB

### Collections

```
MongoDB Database: gsb_db
│
├── users                       # Collection des utilisateurs
│   └── Document structure:
│       {
│         _id: ObjectId,
│         name: String,
│         email: String (unique),
│         password: String (hashed),
│         role: String,
│         type_sso: String,
│         external_id: String,
│         createdAt: Date
│       }
│
└── bills                       # Collection des factures
    └── Document structure:
        {
          _id: ObjectId,
          date: String,
          amount: Number,
          proof: String (S3 URL),
          description: String,
          status: String,
          type: String,
          user: ObjectId (ref: 'User'),
          createdAt: String
        }
```

### Relations

```
User (1) ───── (n) Bill

Un utilisateur peut avoir plusieurs factures.
Une facture appartient à un seul utilisateur.

Relation stockée dans Bill:
{
  user: ObjectId("65f8a9c7...")  // Référence vers User._id
}

Pour récupérer les infos de l'utilisateur:
await Bill.findById(id).populate('user')
```

---

## ☁️ Services externes

### 1. MongoDB Atlas

```
┌─────────────────────────────────┐
│      APPLICATION BACKEND         │
│                                  │
│  mongoose.connect(MONGO_URI)    │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│       MONGODB ATLAS              │
│   (Cloud Database Service)       │
│                                  │
│  Cluster: GSB-Cluster            │
│  Database: gsb_db                │
│  Collections: users, bills       │
└─────────────────────────────────┘
```

**Avantages :**
- Hébergement gratuit (M0)
- Backups automatiques
- Monitoring intégré
- Scalabilité

### 2. AWS S3

```
┌─────────────────────────────────┐
│      APPLICATION BACKEND         │
│                                  │
│  uploadToS3(file)                │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│           AWS S3                 │
│   (Object Storage Service)       │
│                                  │
│  Bucket: gsb-frais-justificatifs │
│  Files: proof_123.jpg            │
│         proof_456.png            │
└─────────────────────────────────┘
             │
             ↓ Public URL
  https://bucket.s3.amazonaws.com/proof_123.jpg
```

**Utilisation :**
- Stockage des justificatifs de frais
- URLs publiques pour accès direct
- Durabilité 99.999999999%

### 3. Google OAuth 2.0

```
     USER                    APP                  GOOGLE
      │                       │                      │
      │  1. Click "Login"     │                      │
      │─────────────────────→ │                      │
      │                       │  2. Redirect         │
      │                       │─────────────────────→│
      │                       │                      │
      │  3. Login + Consent   │                      │
      │←──────────────────────────────────────────── │
      │                       │                      │
      │  4. Authorization     │                      │
      │──────────────────────────────────────────────→
      │                       │                      │
      │                       │  5. Get profile      │
      │                       │←─────────────────────│
      │                       │                      │
      │  6. JWT + Redirect    │                      │
      │←──────────────────────│                      │
      │                       │                      │
```

---

## 🔒 Sécurité

### Niveaux de sécurité

```
1. TRANSPORT
   ├── HTTPS (TLS/SSL)
   └── Headers sécurisés (Helmet.js)

2. AUTHENTIFICATION
   ├── Mots de passe hashés (SHA-256 + SALT)
   ├── JWT avec expiration (24h)
   └── Refresh tokens (à implémenter)

3. AUTORISATION
   ├── Middleware verifyToken
   ├── Middleware isAdmin
   └── Vérification des permissions par route

4. VALIDATION
   ├── Validation des entrées utilisateur
   ├── Sanitization des données
   └── Limites de taille (fichiers, requêtes)

5. RATE LIMITING
   └── À implémenter (express-rate-limit)
```

### Bonnes pratiques implémentées

✅ Mots de passe jamais stockés en clair  
✅ JWT signé et vérifié  
✅ Tokens dans headers (pas dans URL)  
✅ CORS configuré  
✅ Variables sensibles dans .env  
✅ Validation des fichiers uploadés  
✅ Gestion des erreurs sans exposer de détails

---

## 📈 Scalabilité

### Architecture actuelle

```
┌──────────────┐
│   Clients    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Backend     │ (1 instance)
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  MongoDB     │
└──────────────┘
```

### Architecture scalable (future)

```
┌──────────────┐
│   Clients    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
       ├────────────────────┐
       ↓                    ↓
┌──────────────┐    ┌──────────────┐
│  Backend #1  │    │  Backend #2  │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 ↓
         ┌──────────────┐
         │ Redis Cache  │
         └──────┬───────┘
                ↓
         ┌──────────────┐
         │  MongoDB     │
         │  (Replica    │
         │   Set)       │
         └──────────────┘
```

---

## 🔄 Cycle de vie d'une requête

### Exemple détaillé : GET /api/bills

```
1. CLIENT
   GET /api/bills
   Header: Authorization: Bearer eyJhbG...

2. SERVEUR (index.js)
   Reçoit la requête sur le port 5000
   
3. CORS MIDDLEWARE
   Vérifie l'origine de la requête
   Ajoute les headers CORS
   
4. EXPRESS.JSON MIDDLEWARE
   Parse le body JSON (si présent)
   
5. ROUTING
   app.use('/api/bills', billRoute)
   → Redirige vers routes/bill_route.js
   
6. ROUTE HANDLER
   router.get('/', verifyToken, getBills)
   
7. MIDDLEWARE - verifyToken
   a. Extrait le token du header
   b. Vérifie avec jwt.verify(token, JWT_SECRET)
   c. Décode le payload: { id, role, email }
   d. Ajoute à req.user = { id, role, email }
   e. next()
   
8. CONTROLLER - getBills
   a. Récupère req.user.id et req.user.role
   b. Si admin: Bill.find({})
      Si user: Bill.find({ user: req.user.id })
   c. Mongoose envoie la query à MongoDB
   
9. MONGODB
   Recherche dans la collection "bills"
   Retourne les documents correspondants
   
10. MONGOOSE
    Transforme les documents en objets JavaScript
    
11. CONTROLLER
    Retourne res.status(200).json(bills)
    
12. EXPRESS
    Sérialise la réponse en JSON
    Ajoute les headers (Content-Type, etc.)
    
13. CLIENT
    Reçoit la réponse
    Parse le JSON
    Affiche les factures
```

---

## 🎯 Points clés de l'architecture

### Séparation des responsabilités

✅ **Routes** : Définissent les endpoints  
✅ **Middlewares** : Interceptent et transforment  
✅ **Controllers** : Logique métier  
✅ **Models** : Structure et validation des données  
✅ **Utils** : Fonctions réutilisables  

### Modularité

Chaque module est indépendant et peut être testé séparément.

### Extensibilité

Facile d'ajouter :
- Nouveaux modèles
- Nouvelles routes
- Nouveaux middlewares
- Nouveaux services externes

### Maintenabilité

Code organisé, commenté, et documenté.

---

**✨ Architecture conçue pour être robuste, scalable et maintenable**

