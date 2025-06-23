const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const googleId = profile.id;
  
  // Cherche ou crée l’utilisateur dans la BDD
  let user = await findOrCreateUser({
    email,
    nom: profile.name.familyName,
    prenom: profile.name.givenName,
    type_sso: 'google',
    external_id: googleId
  });

  return done(null, user);
}));
