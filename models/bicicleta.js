var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], 
        index: {type:'2dsphere', sparse: true}
    }
});

bicicletaSchema.statics.createInstance = (code, color, modelo, ubicacion) => {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = () => {
    return `code: ${this.code} | color: ${this.color}`;
};
//statics: agregando directo al modelo (Bicicleta)
bicicletaSchema.statics.allBicis = (callback) =>{
    return this.find({}, callback);
};

bicicletaSchema.statics.add = (aBici, callback) =>{
    this.create(aBici, callback);
};

bicicletaSchema.statics.findByCode = (aCode, callback) =>{
    return this.findOne({code: aCode}, callback);
};
bicicletaSchema.statics.removeByCode = (aCode, callback) =>{
    return this.deleteOne({code: aCode}, callback);
};

module.exports = mongoose.model('Bicicleta', bicicletaSchema);