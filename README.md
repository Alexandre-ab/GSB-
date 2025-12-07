# Application GSB - Gestion des Notes de Frais

## 📋 Description
Application web complète pour la gestion des notes de frais avec :
- **Backend** : Node.js + Express + MongoDB
- **Frontend** : React + Vite
- **Authentification** : JWT Token

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v18 ou plus récent)
- MongoDB (ou accès à MongoDB Atlas)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd Test\ bts-gsbbackend\ -\ Copie

# Installer toutes les dépendances
npm run install:all
```

### Configuration Backend
1. Créer un fichier `.env` dans le dossier `back-end/` :
```env
PORT=5000
MONGO_URI=mongodb+srv://admin:admin123@gsb.ycvdfkc.mongodb.net/gsb_db?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt
SALT=votre_salt_secret
NODE_ENV=development
```

2. **Configuration MongoDB Atlas (pour déploiement sur Render)**
   
   Si vous déployez sur Render ou un autre service cloud, vous devez autoriser les connexions depuis ces services :
   
   - Allez sur [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sélectionnez votre cluster
   - Cliquez sur **"Network Access"** dans le menu de gauche
   - Cliquez sur **"Add IP Address"**
   - Pour autoriser toutes les IPs (recommandé pour le développement) :
     - Cliquez sur **"Allow Access from Anywhere"**
     - Ou ajoutez manuellement : `0.0.0.0/0`
   - Pour plus de sécurité en production, ajoutez uniquement l'IP spécifique de Render
   - Cliquez sur **"Confirm"**
   - ⚠️ **Important** : Attendez 2-3 minutes que les changements prennent effet
   
   **Note** : Sans cette configuration, vous obtiendrez l'erreur "Could not connect to any servers in your MongoDB Atlas cluster"

### Démarrage en développement
```bash
# Démarrer backend et frontend simultanément
npm run dev
```

**Ou séparément :**
```bash
# Backend uniquement (port 5000)
npm run dev:backend

# Frontend uniquement (port 5176)
npm run dev:frontend
```

## 🌐 Accès à l'application
- **Frontend** : http://localhost:5176
- **Backend API** : http://localhost:5000/api
- **Test API** : http://localhost:5000/api/test

## 🔑 Authentification
Le token JWT est automatiquement géré :
- Token hardcodé temporaire pour les tests
- Stockage dans localStorage du navigateur
- Envoi automatique dans les headers API

## 📁 Structure du projet
```
├── back-end/                 # API Node.js
│   ├── routes/              # Routes API
│   ├── models/              # Modèles MongoDB
│   ├── middleware/          # Middlewares
│   └── index.js            # Point d'entrée
├── front-end/               # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── services/       # Services API
│   │   └── main.jsx       # Point d'entrée
│   └── package.json
└── package.json            # Scripts globaux
```

## 🛠️ Fonctionnalités

### ✅ Implémentées
- [x] Affichage des demandes avec données réelles de l'API
- [x] Création de nouvelles demandes
- [x] Modification des demandes existantes
- [x] Suppression des demandes
- [x] Authentification JWT
- [x] Interface utilisateur moderne et responsive
- [x] Gestion des erreurs API

### 🔄 En cours
- [ ] Connexion complète CRUD avec backend
- [ ] Upload de fichiers (justificatifs)
- [ ] Notifications en temps réel
- [ ] Filtrage et recherche avancée

## 📡 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription

### Bills (Notes de frais)
- `GET /api/bills` - Récupérer toutes les bills
- `POST /api/bills` - Créer une nouvelle bill
- `PUT /api/bills/:id` - Modifier une bill
- `DELETE /api/bills/:id` - Supprimer une bill

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur

## 🧪 Tests

### Test de connexion API
Naviguez vers le composant `TestAPI` pour vérifier :
- Connexion backend/frontend
- Authentification
- Récupération des données

### Debug
- Console du navigateur pour les logs frontend
- Terminal backend pour les logs serveur
- Vérification du token dans localStorage

## 🔧 Dépannage

### Erreurs courantes
1. **Port déjà utilisé** : Vérifiez que les ports 5000 et 5176 sont libres
2. **CORS Error** : Le backend a CORS activé pour localhost
3. **Token expiré** : Supprimez le token du localStorage et rechargez
4. **MongoDB non connecté** : 
   - Vérifiez la chaîne de connexion dans .env
   - Vérifiez que votre IP est autorisée dans MongoDB Atlas (voir section Configuration)
   - Pour Render : Ajoutez `0.0.0.0/0` dans Network Access de MongoDB Atlas
5. **"vite: not found" sur Render** : Les dépendances frontend ne sont pas installées
   - Le script `build` installe automatiquement toutes les dépendances
   - Vérifiez que le script `build` est bien exécuté avant `start` sur Render

### Logs utiles
```bash
# Backend logs
cd back-end && npm run dev

# Vérifier la base de données
# Connectez-vous à MongoDB Atlas ou votre instance locale
```

## 👨‍💻 Développement

### Scripts disponibles
```bash
npm run dev              # Dev backend + frontend
npm run dev:backend      # Dev backend uniquement  
npm run dev:frontend     # Dev frontend uniquement
npm run build            # Build pour production (installe toutes les dépendances + build frontend)
npm run start            # Démarre backend + frontend en production
npm run install:all      # Installer toutes les dépendances
```

### Déploiement sur Render
1. **Variables d'environnement à configurer** :
   - `MONGO_URI` : Votre URI MongoDB Atlas complète
   - `JWT_SECRET` : Une clé secrète pour signer les tokens JWT
   - `SALT` : Une chaîne aléatoire pour le hachage des mots de passe
   - `NODE_ENV` : `production`
   - `PORT` : Généralement défini automatiquement par Render

2. **Configuration Render** :
   - Build Command : `npm run build`
   - Start Command : `npm start`
   - Root Directory : Laisser vide (racine du projet)

3. **MongoDB Atlas** :
   - N'oubliez pas d'ajouter `0.0.0.0/0` dans Network Access (voir section Configuration)

### Modifications en cours
- Le token est actuellement hardcodé pour les tests
- Les données sont hybrides (API + fallback mocké)
- L'upload de fichiers est en cours d'implémentation

## 📞 Support
Pour toute question ou problème :
1. Vérifiez les logs dans la console
2. Testez avec le composant TestAPI
3. Vérifiez que MongoDB est accessible
4. Redémarrez les serveurs si nécessaire 