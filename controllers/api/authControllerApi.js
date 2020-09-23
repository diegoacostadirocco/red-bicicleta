const Usuario = require('../../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: (req, res, next) => {
        Usuario.findOne({
            email: req.body.email
        }, (err, userInfo) => {
            if (err) {
                next(err);
            } else {
                if (userInfo === null) {
                    return res.status(401).json({
                        status: "error",
                        message: "mail/pwd invalido",
                        data: null
                    });
                }
                if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
                    userInfo.save((err, usuario) => {
                        const token = jwt.sign({
                                id: userInfo._id
                            },
                            req.app.get('secretKey'), {
                                expiresIn: '7d'
                            });
                        res.status(200).json({
                            message: 'usuario encontrado',
                            data: {
                                usuario: userInfo,
                                token: token
                            }
                        });
                    });
                } else {
                    res.status(401).json({
                        status: "error",
                        message: "mail/pwd invalido",
                        data: null
                    });
                }
            }
        });
    },
    forgotPassword: (req, res, next) =>{
        Usuario.findOne({
            email: req.body.email
        }, (err, usuario) => {
            if (!usuario) return res.status(401).json({
                message: "no existe user",
                data: null
            });
            usuario.resetPassword((err) => {
                if (err) {
                    return next(err)
                }
                res.status(200).json({
                    message: "se envio un mail para reestablecer pwd",
                    data: null
                });
            });
        });
    },
}