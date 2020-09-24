const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/usuario');

passport.use(new LocalStrategy(
    (email, password, done) =>{
        Usuario.findOne({email: email}, (err, usuario) =>{
            if (err) return done(err);
            if (!user) return done (null, false, { message: 'Email no existe / incorrecto'})
            if (!usuario.validPassword(password)) return done(null, false, {message: 'Contraseña incorrecta'})

            return done(null, usuario);
        });
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) =>{
        console.log(profile);

        Usuario.findOneOrCreateByGoogle(profile, (err, user) =>{
            return cb(err, user);
        });
    }
));

passport.serializeUser((user, cb) =>{
    cb(null, user.id);
})

passport.deserializeUser((user, cb) =>{
    Usuario.findById(id, (err, usuario) =>{
        cb(err, usuario);
    })
});

module.exports = passport;