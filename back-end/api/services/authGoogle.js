const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, findOrCreateUser } = require('../../models/user_model');

/**
 * Configuration de l'authentification Google OAuth 2.0
 * Utilise Passport.js pour gérer le flux d'authentification
 */

/**
 * Stratégie d'authentification Google
 * 
 * Logique :
 * 1. L'utilisateur clique sur "Se connecter avec Google"
 * 2. Redirection vers Google pour authentification
 * 3. Google retourne le profil de l'utilisateur
 * 4. On recherche ou crée l'utilisateur dans notre base de données
 * 5. L'utilisateur est authentifié dans notre application
 */
passport.use(new GoogleStrategy({
    clientID: "QWFvOstFhgUt6nw7SsdYTIn1ArYf6UCs",
    clientSecret:"-nOL6ili7Ij4umBnp6NxLxabx5Z3p9vUKNwMk31iTwVIRPMaIQ5iS3AWKUhJnga5",
    callbackURL:"/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Rechercher ou créer l'utilisateur avec le profil Google
        const user = await findOrCreateUser(profile);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

/**
 * Sérialisation de l'utilisateur pour les sessions
 * Convertit l'objet utilisateur en identifiant pour le stocker en session
 */
passport.serializeUser((user, done) => {
    done(null, user._id);
});

/**
 * Désérialisation de l'utilisateur
 * Récupère l'utilisateur complet à partir de l'identifiant stocké en session
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport; 