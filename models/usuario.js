var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10;

const Token = require ('../models/token');
const mailer = require ('../mailer/mailer');

var Schema = mongoose.Schema;

const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

var usuarioSchema = new Schema ({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El mail es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un mail valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario'});

usuarioSchema.pre('save', (next) => {
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = (password) =>{
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar = (biciId, desde, hasta, callback) =>{
    var reserva = new Reserva ({
        usuario: this._id,
        bicicleta: biciId,
        desde: desde,
        hasta: hasta
    });
    console.log(reserva);
    reserva.save(callback);
}



usuarioSchema.methods.enviar_email_bienvenida = (callback) =>{
    const token = new Token ({
        _userId: this.id,
        token: crypto.randombytes(16).toString('hex')
    });
    const email_destination = this.email;
    token.save((err) =>{
        if (err) {
            return console.log(err.message);;
        }
        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'verificacion de cuenta',
            text:'hola, \n\n' + 
            'Por favor para verificar su cuenta su cuenta haga click en este link: \n'
             + 'http://localhost:5000' + '\/token/confirmation\/' + token.token + '.\n'
        };
        mailer.sendMail(mailOptions, (err) =>{
            if(err) {
                return console.log(err.message);;
            }
            console.log('Se envio un email de verificacion a: ' + email_destination + '.');
        });
    });
}


usuarioSchema.methods.resetPassword = (callback) =>{
    const token = new Token ({
        _userId: this.id,
        token: crypto.randombytes(16).toString('hex')
    });
    const email_destination = this.email;
    token.save((err) =>{
        if (err) {
            return callback(err);
        }
        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text:'hola, \n\n' + 
            'Por favor para resetear el password de su cuenta haga click en este link: \n'
             + 'http://localhost:5000' + '\/resetPassword\/' + token.token + '.\n'
        };
        mailer.sendMail(mailOptions, (err) =>{
            if(err) {
                return callback(err);
            }
            console.log('Se envio un email para resetear el password a: ' + email_destination + '.');
        });
        callback(null)
    });
};

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
    const self = this;
    console.log(condition);
    self.findOne({
        $or:[
            {'googleId': condition.id}, {'email': condition.emails[0].value}
        ]}, (err, result) =>{
            if(result){
                callback(err, result)
            } else {
                console.log('----------CONDITION----------');
                console.log(condition);
                let values= {};
                values.googleId = condition.id;
                values.email = condition.emails[0].value;
                values.nombre = condition.displayName || 'SIN NOMBRE';
                values.verificado = true;
                values.password = condition._json.etag;
                console.log('-------------VALUES-----------');
                console.log(values);
                self.create(values, (err, result) =>{
                    if(err){
                        console.log(err);
                    }return callback(err, result)
                })
            }
        }
    )
}

module.exports = mongoose.model('Usuario', usuarioSchema);