const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require("express-session")
const jwt = require('jsonwebtoken')

// Configuration passport
require('./api/services/authGoogle')

// Import des routes
const userRoute = require('./routes/user_route')
const authenticationRoute = require('./routes/authentication_route')
const billRoute = require('./routes/bill_route')

// Configuration
dotenv.config()
const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Configuration des sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "-nOL6ili7Ij4umBnp6NxLxabx5Z3p9vUKNwMk31iTwVIRPMaIQ5iS3AWKUhJnga5",
  resave: false,
  saveUninitialized: false
}))

// Initialisation de Passport
app.use(passport.initialize())
app.use(passport.session())

// Connexion à MongoDB avec options améliorées
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@gsb.ycvdfkc.mongodb.net/gsb_db?retryWrites=true&w=majority'
        
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
            socketTimeoutMS: 45000, // Timeout socket
            connectTimeoutMS: 10000, // Timeout de connexion
            maxPoolSize: 10, // Nombre max de connexions
            minPoolSize: 5, // Nombre min de connexions
        }
        
        await mongoose.connect(mongoURI, options)
        console.log('✅ Connecté à MongoDB avec succès')
        
        // Gestion des événements de connexion
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
        console.error('❌ Erreur de connexion à MongoDB:', error.message)
        console.error('URI utilisée:', process.env.MONGO_URI ? 'MONGO_URI depuis .env' : 'URI par défaut')
        process.exit(1) // Arrêter le serveur si MongoDB ne peut pas se connecter
    }
}

// Routes d'authentification Google
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}))

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      // Générer un JWT pour l'utilisateur authentifié
      const token = jwt.sign(
        { 
          id: req.user._id, 
          role: req.user.role, 
          email: req.user.email 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      )
      
      // Rediriger vers le frontend avec le token
      res.redirect(`http://localhost:5176/auth/callback?token=${token}`)
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error)
      res.redirect("http://localhost:5176/login?error=token_error")
    }
  }
)

// Routes API
app.use('/api/users', userRoute)
app.use('/api/auth', authenticationRoute)
app.use('/api/bills', billRoute)

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne correctement' })
})

// Endpoint pour récupérer l'utilisateur connecté
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user)
  } else {
    res.status(401).json({ error: "Not authenticated" })
  }
})

// Gestion des routes non trouvées
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

// Démarrage du serveur - ATTENDRE que MongoDB soit connecté
const startServer = async () => {
    try {
        // Attendre la connexion MongoDB
        await connectDB()
        
        // Démarrer le serveur seulement après la connexion MongoDB
        app.listen(port, () => {
            console.log(`🚀 Serveur en cours d'exécution sur le port ${port}`)
            console.log(`📡 API disponible sur http://localhost:${port}/api`)
        })
    } catch (error) {
        console.error('❌ Impossible de démarrer le serveur:', error)
        process.exit(1)
    }
}

// Démarrer l'application
startServer()
