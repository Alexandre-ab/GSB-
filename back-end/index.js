/**
 * =====================================
 * API Backend GSB - Serveur Express
 * =====================================
 * 
 * Ce fichier est le point d'entrée principal de l'application backend.
 * Il configure et démarre le serveur Express avec :
 * - Connexion à MongoDB
 * - Authentification JWT et Google OAuth
 * - Routes API pour les utilisateurs et factures
 */

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require("express-session")
const jwt = require('jsonwebtoken')

// Charger la configuration Passport pour Google OAuth
require('./api/services/authGoogle')

// Import des routes
const userRoute = require('./routes/user_route')
const authenticationRoute = require('./routes/authentication_route')
const billRoute = require('./routes/bill_route')

// Charger les variables d'environnement depuis .env
dotenv.config()

// Initialisation de l'application Express
const app = express()
const port = process.env.PORT || 5000

/**
 * =====================================
 * MIDDLEWARES
 * =====================================
 */

// CORS : Autoriser les requêtes cross-origin (seulement depuis le frontend)
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5176',
  credentials: true
};
app.use(cors(corsOptions))

// Parser JSON : Permettre de recevoir des données JSON
app.use(express.json())

// Parser URL-encoded : Permettre de recevoir des données de formulaire
app.use(express.urlencoded({ extended: false }))

// Configuration des sessions Express (nécessaire pour Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || "-nOL6ili7Ij4umBnp6NxLxabx5Z3p9vUKNwMk31iTwVIRPMaIQ5iS3AWKUhJnga5",
  resave: false,
  saveUninitialized: false
}))

// Initialisation de Passport pour l'authentification
app.use(passport.initialize())
app.use(passport.session())

/**
 * =====================================
 * CONNEXION À MONGODB
 * =====================================
 * 
 * Logique :
 * 1. Récupérer l'URI MongoDB depuis les variables d'environnement
 * 2. Configurer les options de connexion (timeouts, pool de connexions)
 * 3. Se connecter à MongoDB avec Mongoose
 * 4. Configurer les gestionnaires d'événements (erreur, déconnexion, reconnexion)
 * 5. En cas d'erreur, afficher un message détaillé avec des solutions
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@gsb.ycvdfkc.mongodb.net/gsb_db?retryWrites=true&w=majority'
        
        const options = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            maxPoolSize: 10,
            minPoolSize: 5,
            retryWrites: true,
            w: 'majority'
        }
        
        await mongoose.connect(mongoURI, options)
        console.log('✅ Connecté à MongoDB avec succès')
        
        // Gestionnaires d'événements de connexion
        mongoose.connection.on('error', (err) => {
            console.error('❌ Erreur MongoDB:', err)
        })
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB déconnecté')
        })
        
        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnecté')
        })
        
        return true
    } catch (error) {
        // Affichage d'un message d'erreur détaillé avec solutions
        console.error('\n❌ ============================================')
        console.error('❌ ERREUR DE CONNEXION À MONGODB')
        console.error('❌ ============================================')
        console.error('Message:', error.message)
        console.error('\n📋 CAUSES POSSIBLES:')
        
        if (error.message.includes('whitelist') || error.message.includes('IP')) {
            console.error('   → Votre IP n\'est pas autorisée dans MongoDB Atlas')
            console.error('\n🔧 SOLUTION:')
            console.error('   1. Allez sur https://cloud.mongodb.com/')
            console.error('   2. Sélectionnez votre cluster')
            console.error('   3. Cliquez sur "Network Access"')
            console.error('   4. Ajoutez "0.0.0.0/0" pour autoriser toutes les IPs')
        } else if (error.message.includes('authentication')) {
            console.error('   → Problème d\'authentification')
            console.error('\n🔧 SOLUTION:')
            console.error('   Vérifiez votre MONGO_URI dans .env')
        } else if (error.message.includes('timeout')) {
            console.error('   → Timeout de connexion')
            console.error('\n🔧 SOLUTION:')
            console.error('   - Vérifiez votre connexion internet')
            console.error('   - Vérifiez que MongoDB Atlas est accessible')
        }
        
        console.error('\n📝 URI utilisée:', process.env.MONGO_URI ? 'MONGO_URI depuis .env' : 'URI par défaut')
        console.error('❌ ============================================\n')
        process.exit(1)
    }
}

/**
 * =====================================
 * ROUTES - AUTHENTIFICATION GOOGLE
 * =====================================
 */

/**
 * Redirection vers Google pour l'authentification
 * Demande l'accès au profil et à l'email de l'utilisateur
 */
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}))

/**
 * Callback après authentification Google
 * 
 * Logique :
 * 1. Google redirige ici après authentification
 * 2. Passport vérifie et récupère les informations de l'utilisateur
 * 3. On génère un token JWT pour l'utilisateur
 * 4. On redirige vers le frontend avec le token
 */
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      // Générer un token JWT contenant les infos de l'utilisateur
      const token = jwt.sign(
        { 
          id: req.user._id, 
          role: req.user.role, 
          email: req.user.email 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      )
      
      // Rediriger vers le frontend avec le token en query param
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5176';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`)
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5176';
      res.redirect(`${frontendUrl}/login?error=token_error`)
    }
  }
)

/**
 * =====================================
 * ROUTES - API
 * =====================================
 */

// Routes pour la gestion des utilisateurs
app.use('/api/users', userRoute)

// Routes pour l'authentification (login)
app.use('/api/auth', authenticationRoute)

// Routes pour la gestion des factures
app.use('/api/bills', billRoute)

// Route de test pour vérifier que l'API fonctionne
app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne correctement' })
})

// Endpoint pour récupérer l'utilisateur actuellement connecté (session)
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user)
  } else {
    res.status(401).json({ error: "Not authenticated" })
  }
})

/**
 * =====================================
 * GESTION DES ERREURS
 * =====================================
 */

// Gestion des routes non trouvées (404)
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' })
})

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        message: 'Une erreur est survenue sur le serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
})

/**
 * =====================================
 * DÉMARRAGE DU SERVEUR
 * =====================================
 * 
 * Logique :
 * 1. D'abord, se connecter à MongoDB
 * 2. Si la connexion réussit, démarrer le serveur Express
 * 3. Si la connexion échoue, arrêter l'application
 * 
 * Important : Le serveur ne démarre que si MongoDB est connecté
 * pour éviter les erreurs lors des requêtes.
 */
const startServer = async () => {
    try {
        // Étape 1 : Connexion à MongoDB
        await connectDB()
        
        // Étape 2 : Démarrage du serveur Express
        app.listen(port, () => {
            console.log(`🚀 Serveur en cours d'exécution sur le port ${port}`)
            console.log(`📡 API disponible sur http://localhost:${port}/api`)
        })
    } catch (error) {
        console.error('❌ Impossible de démarrer le serveur:', error)
        process.exit(1)
    }
}

// Lancer l'application
startServer()
