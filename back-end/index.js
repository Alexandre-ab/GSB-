const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

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

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:admin123@gsb.ycvdfkc.mongodb.net/gsb_db?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connecté à MongoDB')
    })
    .catch(err => {
        console.error('Erreur de connexion à MongoDB:', err)
    })

// Routes
app.use('/api/users', userRoute)
app.use('/api/auth', authenticationRoute)
app.use('/api/bills', billRoute)

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'API fonctionne correctement' })
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

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`)
})