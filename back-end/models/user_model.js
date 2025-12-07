const mongoose = require('mongoose')
const sha256 = require('js-sha256')

// Définir le schéma d'abord
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    // Champs pour SSO
    type_sso: {
        type: String,
        enum: ['local', 'google', 'microsoft'],
        default: 'local'
    },
    external_id: {
        type: String,
        sparse: true // Permet null/undefined
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Hook pre('save') - DOIT être défini AVANT mongoose.model()
userSchema.pre('save', async function(next) {
    try {
        if(!process.env.SALT) {
            throw new Error('SALT is not defined', { cause: 501 })
        }
        // Vérifier l'existence seulement pour les nouveaux utilisateurs
        if (this.isNew) {
            // Utiliser this.constructor au lieu de User pour éviter la référence circulaire
            const UserModel = this.constructor
            const existingUser = await UserModel.findOne({ email: this.email })
            if (existingUser && existingUser._id.toString() !== this._id.toString()) {
                throw new Error('User already exists', { cause: 400 })
            }
        }
        
        // Hasher le mot de passe seulement s'il a été modifié ou si c'est un nouvel utilisateur
        if (this.isModified('password') || this.isNew) {
            this.password = sha256(this.password + process.env.SALT)
        }
        next()
    } catch (error) {
        next(error)
    }
})

// Créer le modèle User APRÈS avoir défini les hooks
const User = mongoose.model('User', userSchema)

// Fonction findOrCreateUser - maintenant User est défini
const findOrCreateUser = async (profile) => {
    const existingUser = await User.findOne({ email: profile.emails[0].value });
  
    if (existingUser) return existingUser;
  
    const newUser = new User({
      name: profile.name.givenName + ' ' + profile.name.familyName,
      email: profile.emails[0].value,
      password: sha256(profile.id + process.env.SALT),
      role: "user",
      type_sso: "google",
      external_id: profile.id
    });
  
    await newUser.save();
    return newUser;
}

module.exports = { User, findOrCreateUser }