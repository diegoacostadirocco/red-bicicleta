const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new LocalStrategy());

passport.serializeUser((user, cb) =>{
    cb(null, user.id);
})

passport.deserializeUser((user, cb) =>{
    Usuario.findById(id, (err, usuario) =>{
        cb(err, usuario);
    })
});

module.exports = passport;