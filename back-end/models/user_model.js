const mongoose = require('mongoose')
const sha256 = require('js-sha256')

/**
 * Schéma Mongoose pour le modèle User
 * Définit la structure des documents utilisateur dans MongoDB
 */
const userSchema = new mongoose.Schema({
    // Nom complet de l'utilisateur
    name: {     
        type: String,
        required: true,
    },
    // Email unique pour l'authentification
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Mot de passe hashé avec SHA-256 et un salt
    password: {
        type: String,
        required: true,
    },
    // Rôle de l'utilisateur (user, admin, etc.)
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    // Type d'authentification utilisé (local, google, microsoft)
    type_sso: {
        type: String,
        enum: ['local', 'google', 'microsoft'],
        default: 'local'
    },
    // Identifiant externe pour l'authentification SSO
    external_id: {
        type: String,
        sparse: true // Permet null/undefined pour les comptes locaux
    },
    // Date de création du compte
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

/**
 * Hook pre-save pour le modèle User
 * Exécuté automatiquement avant chaque sauvegarde d'un document User
 * 
 * Logique :
 * 1. Vérification que la variable SALT est définie (nécessaire pour le hashing)
 * 2. Si c'est un nouvel utilisateur, vérifier que l'email n'existe pas déjà
 * 3. Si le mot de passe a été modifié ou si c'est un nouvel utilisateur, le hasher avec SHA-256 + SALT
 */
userSchema.pre('save', async function(next) {
    try {
        // Vérifier que le SALT est défini dans les variables d'environnement
        if(!process.env.SALT) {
            throw new Error('SALT is not defined', { cause: 501 })
        }
        
        // Pour les nouveaux utilisateurs, vérifier que l'email n'existe pas déjà
        if (this.isNew) {
            const UserModel = this.constructor
            const existingUser = await UserModel.findOne({ email: this.email })
            if (existingUser && existingUser._id.toString() !== this._id.toString()) {
                throw new Error('User already exists', { cause: 400 })
            }
        }
        
        // Hasher le mot de passe si nécessaire (nouveau ou modifié)
        if (this.isModified('password') || this.isNew) {
            this.password = sha256(this.password + process.env.SALT)
        }
        
        next()
    } catch (error) {
        next(error)
    }
})

/**
 * Création du modèle User à partir du schéma
 * Mongoose gère automatiquement la réutilisation des modèles existants
 */
const User = mongoose.model('User', userSchema);

/**
 * Fonction utilitaire pour l'authentification Google OAuth
 * Recherche un utilisateur existant par email, sinon en crée un nouveau
 * 
 * @param {Object} profile - Profil Google de l'utilisateur
 * @returns {Promise<Object>} - Document utilisateur trouvé ou créé
 */
const findOrCreateUser = async (profile) => {
    // Rechercher un utilisateur avec cet email
    const existingUser = await User.findOne({ email: profile.emails[0].value });
    
    // Si l'utilisateur existe, le retourner
    if (existingUser) return existingUser;
    
    // Sinon, créer un nouvel utilisateur avec les données Google
    const newUser = new User({
        name: profile.name.givenName + ' ' + profile.name.familyName,
        email: profile.emails[0].value,
        password: sha256(profile.id + process.env.SALT), // Hash de l'ID Google comme mot de passe
        role: "user",
        type_sso: "google",
        external_id: profile.id
    });
    
    await newUser.save();
    return newUser;
}

// Export du modèle User et de la fonction helper
module.exports = { 
    User, 
    findOrCreateUser,
    userSchema
}

