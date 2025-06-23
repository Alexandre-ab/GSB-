const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, findOrCreateUser } = require('../../models/user_model');

// Configuration de la stratégie Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Profil Google reçu:', profile);
        
        // Utiliser la fonction findOrCreateUser du modèle
        const user = await findOrCreateUser(profile);
        return done(null, user);
        
    } catch (error) {
        console.error('Erreur lors de l\'authentification Google:', error);
        return done(error, null);
    }
}));

// Sérialisation pour les sessions
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport; 