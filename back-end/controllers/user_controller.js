const { sha256 } = require('js-sha256')
const User = require('../models/user_model')

const createUser = async (req, res) => {
    try {
        // Vérification que req.body existe
        if (!req.body) {
            return res.status(400).json({ message: "Données manquantes" });
        }

        console.log("Données reçues:", req.body); // Log pour déboguer

        const { name, email, password, role } = req.body;

        // Vérification que tous les champs requis sont présents
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                message: "Tous les champs sont requis (name, email, password, role)" 
            });
        }

        const user = new User({ name, email, password, role })
        await user.save()
        
        // Ne pas renvoyer le mot de passe dans la response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse)
    } catch (error) {
        console.error("Erreur complète:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation échouée", 
                details: error.message 
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Email déjà utilisé" 
            });
        }
        
        if (error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Server error",
             details: process.env.NODE_ENV === 'developement' ? error.message : undefined, error : process.env.NODE_ENV === 'developement' ? error.stack : undefined })
    }
}

const getUsers = async (req, res) => {
    try {
        // if email is provided, find user by email else find all users
        const email = req.query.email ? {email: req.query.email} : {}
        const users = await User.find(email)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error('User not found', { cause: 404 })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

const updateUser = async (req, res) => {
    try {
        const { email } = req.query
        const { name, newEmail, password, role } = req.body
        const newPassword = password && sha256(password)
        const user = await User.findOneAndUpdate({ email }, { name, email: newEmail, password: newPassword, role }, { new: true })
        if (!user) {
            throw new Error('User not found', { cause: 404 })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        if (error['cause'] === 404) {
            res.status(404).json({ message: error.message })
        } else {
            res.status(500).json({ message: "Server error" })
        }
    }
}

const deleteUser = async (req, res) => {
    try {
        const { email } = req.query
        await User.findOneAndDelete({email})
        res.status(200).json({ message: 'User deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { createUser, getUsers, getUserByEmail, updateUser, deleteUser }

