var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema ({
    nombre: String,
});

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

module.exports = mongoose.model('Usuario', usuarioSchema);