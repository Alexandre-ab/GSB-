const jwt = require('jsonwebtoken');
const { User } = require('../models/user_model');
const sha256 = require('js-sha256')

// Login method that will check if the user exists and if the password is correct returns a token
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        // Vérifier que les variables d'environnement sont définies
        if (!process.env.SALT || !process.env.JWT_SECRET) {
            console.error('Variables d\'environnement manquantes:', {
                SALT: !!process.env.SALT,
                JWT_SECRET: !!process.env.JWT_SECRET
            })
            return res.status(500).json({ 
                message: 'Configuration serveur incomplète',
                error: 'Variables d\'environnement manquantes'
            })
        }
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' })
        }
        
        const user = await User.findOne({ email })
        if (!user) 
           return res.status(401).json({ message: 'Invalid email or password' })
           
        console.log('Password check:', user.password)
        if (user.password !== sha256(password + process.env.SALT)) {
           return res.status(401).json({ message: 'Invalid email or password' })
        }
        
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        )
        res.status(200).json({ token })
    } catch (error) {
        console.error('Erreur lors du login:', error)
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' })
    }
    
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }
        req.user = decoded
        next()
    })
}

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' })
    }
}

const loginGoogle = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) 
       return res.status(401).json({ message: 'Invalid email or password' })
    console.log(user.password)
    if (user.password !== sha256(password + process.env.SALT)) {
       return res.status(401).json({ message: 'Invalid email or password2' })
    }
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.status(200).json({ token })
}

module.exports = { login, verifyToken, isAdmin }
