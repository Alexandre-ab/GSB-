import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { findOrCreateUser } from "../../../back-end/models/user_model"; 
import { User } from "../../../back-end/models/user_model";

passport.use(new GoogleStrategy({ 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    // Rechercher ou créer l'utilisateur dans la base
    const user = await findOrCreateUser(profile);
    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  // Récupérer l’utilisateur depuis la base
  User.findById(id).then(user => done(null, user));
});
