const jwt = require('jsonwebtoken');
const { User } = require('../models/user_model');
const sha256 = require('js-sha256')

/**
 * Contrôleur pour l'authentification et l'autorisation
 * Gère le login, la vérification des tokens JWT et les permissions
 */

/**
 * Connexion d'un utilisateur
 * Route: POST /api/auth/login
 * 
 * Logique :
 * 1. Valider les données reçues (email et password)
 * 2. Rechercher l'utilisateur par email
 * 3. Hasher le mot de passe fourni et le comparer au hash stocké
 * 4. Si authentification réussie, générer un token JWT
 * 5. Retourner le token au client
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        // Vérifier que les variables d'environnement nécessaires sont définies
        if (!process.env.SALT || !process.env.JWT_SECRET) {
            return res.status(500).json({ 
                message: 'Configuration serveur incomplète'
            })
        }
        
        // Valider les données d'entrée
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' })
        }
        
        // Rechercher l'utilisateur par email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        // Hasher le mot de passe fourni et comparer avec celui stocké
        const providedPasswordHash = sha256(password + process.env.SALT)
        const storedPasswordHash = user.password
        
        if (storedPasswordHash !== providedPasswordHash) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        // Générer un token JWT valide pour 24 heures
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        )
        
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Middleware de vérification du token JWT
 * 
 * Logique :
 * 1. Extraire le token du header Authorization (format: "Bearer <token>")
 * 2. Vérifier la validité du token avec JWT_SECRET
 * 3. Si valide, décoder le token et ajouter les infos utilisateur à req.user
 * 4. Passer au middleware suivant, sinon retourner 401
 */
const verifyToken = (req, res, next) => {
    // Récupérer le header Authorization
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' })
    }
    
    // Extraire le token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }
    
    // Vérifier et décoder le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }
        // Ajouter les informations de l'utilisateur à la requête
        req.user = decoded
        next()
    })
}

/**
 * Middleware de vérification du rôle admin
 * 
 * Logique :
 * - Vérifier que req.user existe (doit être utilisé après verifyToken)
 * - Vérifier que le rôle de l'utilisateur est 'admin'
 * - Si oui, passer au middleware suivant, sinon retourner 403
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' })
    }
}

/**
 * Récupérer les informations de l'utilisateur connecté
 * Route: GET /api/users/me
 * 
 * Logique :
 * - Utilise le token décodé dans req.user (ajouté par verifyToken)
 * - Recherche l'utilisateur complet dans la base de données
 * - Retourne les informations sans le mot de passe
 */
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

// Export des fonctions d'authentification et des middlewares
module.exports = { login, verifyToken, isAdmin, getCurrentUser }
