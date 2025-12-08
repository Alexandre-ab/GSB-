const { sha256 } = require('js-sha256')
const { User } = require('../models/user_model')

/**
 * Contrôleur pour la gestion des utilisateurs
 * Contient les méthodes CRUD (Create, Read, Update, Delete)
 */

/**
 * Créer un nouvel utilisateur
 * Route: POST /api/users
 * 
 * Logique :
 * 1. Valider les données reçues (name, email, password, role)
 * 2. Créer une instance du modèle User
 * 3. Sauvegarder dans la base de données (le hook pre-save hashera le mot de passe)
 * 4. Retourner l'utilisateur créé sans le mot de passe
 */
const createUser = async (req, res) => {
    try {
        // Vérifier que les données sont présentes
        if (!req.body) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        const { name, email, password, role } = req.body;

        // Valider que tous les champs requis sont présents
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                message: "Tous les champs sont requis (name, email, password, role)" 
            });
        }

        // Créer un nouvel utilisateur
        const user = new User({ name, email, password, role})
        await user.save() // Le mot de passe sera hashé automatiquement par le hook pre-save
        
        // Préparer la réponse sans inclure le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse)
    } catch (error) {
        // Gestion des différents types d'erreurs
        
        // Erreur de validation Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation échouée", 
                details: error.message 
            });
        }
        
        // Erreur de duplication (email déjà utilisé)
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Email déjà utilisé" 
            });
        }
        
        // Erreur custom du hook pre-save
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        
        // Erreur serveur générique
        res.status(500).json({ 
            message: "Server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

/**
 * Récupérer tous les utilisateurs ou filtrer par email
 * Route: GET /api/users?email=exemple@email.com (optionnel)
 * 
 * Logique :
 * - Si un paramètre email est fourni, rechercher l'utilisateur spécifique
 * - Sinon, retourner tous les utilisateurs
 */
const getUsers = async (req, res) => {
    try {
        // Construire le filtre : si email fourni, chercher par email, sinon objet vide (tous)
        const filter = req.query.email ? { email: req.query.email } : {}
        const users = await User.find(filter)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

/**
 * Récupérer un utilisateur par email
 * Route: GET /api/users/by-email?email=exemple@email.com
 * 
 * Logique :
 * - Rechercher l'utilisateur avec l'email fourni
 * - Retourner 404 si non trouvé
 */
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query
        const user = await User.findOne({ email })
        
        if (!user) {
            throw new Error('User not found', { cause: 404 })
        }
        
        res.status(200).json(user)
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

/**
 * Mettre à jour un utilisateur
 * Route: PUT /api/users?email=exemple@email.com
 * 
 * Logique :
 * 1. Identifier l'utilisateur par email (query param)
 * 2. Mettre à jour les champs fournis (name, newEmail, password, role)
 * 3. Si un nouveau mot de passe est fourni, le hasher avec SHA-256
 * 4. Retourner l'utilisateur mis à jour
 */
const updateUser = async (req, res) => {
    try {
        const { email } = req.query
        const { name, newEmail, password, role } = req.body
        
        // Si un nouveau mot de passe est fourni, le hasher
        const newPassword = password && sha256(password + process.env.SALT)
        
        // Mettre à jour l'utilisateur et retourner le document mis à jour
        const user = await User.findOneAndUpdate(
            { email }, 
            { name, email: newEmail, password: newPassword, role }, 
            { new: true }
        )
        
        if (!user) {
            throw new Error('User not found', { cause: 404 })
        }
        
        res.status(200).json(user)
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

/**
 * Supprimer un utilisateur
 * Route: DELETE /api/users?email=exemple@email.com
 * 
 * Logique :
 * - Identifier l'utilisateur par email
 * - Supprimer le document de la base de données
 */
const deleteUser = async (req, res) => {
    try {
        const { email } = req.query
        await User.findOneAndDelete({ email })
        res.status(200).json({ message: 'User deleted' })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

// Export des fonctions du contrôleur
module.exports = { createUser, getUsers, getUserByEmail, updateUser, deleteUser }

