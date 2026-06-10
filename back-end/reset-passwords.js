/**
 * Remet à zéro les mots de passe des comptes de test
 * avec le SALT actuellement défini dans .env
 *
 * Usage : node reset-passwords.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const sha256 = require('js-sha256')
const { User } = require('./models/user_model')

const ACCOUNTS = [
    { email: 'alice@example.com', password: 'motdepasse123' },
    { email: 'admin@gsb.fr',      password: 'Admin123!'     }
]

const run = async () => {
    const SALT = process.env.SALT
    if (!SALT) {
        console.error('❌ Variable SALT manquante dans .env')
        process.exit(1)
    }

    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@gsb.ycvdfkc.mongodb.net/gsb_db?retryWrites=true&w=majority'
    await mongoose.connect(mongoURI)
    console.log('✅ Connecté à MongoDB\n')

    for (const account of ACCOUNTS) {
        const hash = sha256(account.password + SALT)
        const user = await User.findOneAndUpdate(
            { email: account.email },
            { password: hash },
            { new: true }
        )
        if (user) {
            console.log('✅ Mot de passe réinitialisé :', account.email)
        } else {
            console.log('❌ Compte introuvable :', account.email)
        }
    }

    await mongoose.disconnect()
    console.log('\n✅ Terminé.')
}

run().catch(console.error)
