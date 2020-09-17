const passport = require('passport');
const usuario = require('../models/usuario');
const LocalStrategy = require('passport-local').Strategy;
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

passport.serializeUser((user, cb) =>{
    cb(null, user.id);
})

passport.deserializeUser((user, cb) =>{
    Usuario.findById(id, (err, usuario) =>{
        cb(err, usuario);
    })
});

module.exports = passport;