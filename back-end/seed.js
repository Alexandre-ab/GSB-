/**
 * Script de seed — Crée les comptes de test documentés dans le README
 *
 * Usage :
 *   node seed.js
 *
 * Les comptes créés correspondent exactement à ceux listés dans le README :
 *   - alice@example.com  / motdepasse123  (rôle : user)
 *   - admin@gsb.fr       / Admin123!      (rôle : admin)
 */

require('dotenv').config()
const mongoose = require('mongoose')
const { User } = require('./models/user_model')

const ACCOUNTS = [
    {
        name: 'Alice Martin',
        email: 'alice@example.com',
        password: 'motdepasse123',
        role: 'user',
        type_sso: 'local'
    },
    {
        name: 'Admin GSB',
        email: 'admin@gsb.fr',
        password: 'Admin123!',
        role: 'admin',
        type_sso: 'local'
    }
]

const seed = async () => {
    if (!process.env.SALT) {
        console.error('❌ Variable SALT manquante dans le fichier .env')
        process.exit(1)
    }

    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@gsb.ycvdfkc.mongodb.net/gsb_db?retryWrites=true&w=majority'

    try {
        await mongoose.connect(mongoURI)
        console.log('✅ Connecté à MongoDB\n')

        for (const account of ACCOUNTS) {
            const existing = await User.findOne({ email: account.email })

            if (existing) {
                console.log(`⚠️  Compte existant ignoré : ${account.email}`)
            } else {
                // Le hook pre-save du modèle User hache automatiquement le mot de passe
                const user = new User(account)
                await user.save()
                console.log(`✅ Compte créé : ${account.email} (rôle : ${account.role})`)
            }
        }

        console.log('\n✅ Seed terminé.')
    } catch (error) {
        console.error('❌ Erreur lors du seed :', error.message)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
    }
}

seed()
