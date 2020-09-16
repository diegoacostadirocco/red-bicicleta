var Usuario = require('../models/usuario');
var Token = require('../models/token');
const usuario = require('../models/usuario');

module.exports = {
    confirmationGet: (req, res) =>{
        Token.findOne({ token: req.params.token}, (err, token) =>{
            if(!token) {
                return res.status(400).send({
                    type: 'not-verified',
                    msg: 'No existe token para el usuario'
                })
            }
            Usuario.findById(token_userId, (err, usuario) =>{
                if(!usuario) {
                    return res.status(400).send({
                        msg:'No encontramos usuario con ese token'
                    })
                }
                if(usuario.verificado) {
                    return res.redirect('/usuarios');
                    };
                usuario.verificado = true;
                usuario.save ((err) =>{
                    if (err) {
                        return res.status(500).send({
                            msg: err.message
                        });
                    }
                    res.redirect('/');
                });
            });
        });
    }
}