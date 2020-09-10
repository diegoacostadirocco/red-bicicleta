var Bicicleta = function(id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function() {
    return 'id: ' + this.id + " | color: " + this.color;
}

Bicicleta.allBicis = [];
Bicicleta.add = (aBici) => {
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findById = (aBiciId) =>{
    var aBici = Bicicleta.allBicis.find(x => x.id === aBiciId);
    if(aBici)
        return aBici;
    else
        throw new Error(`no existe bicicleta con id ${aBiciId}`)
}

Bicicleta.removeById = (aBiciId) =>{
    Bicicleta.findById(aBiciId);
    for(var i = 0; i < Bicicleta.allBicis.length;i++){
        if(Bicicleta.allBicis[i].id === aBiciId){
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}


// var a = new Bicicleta(1, 'Rojo', 'Montaña', [-34.6012424,-58.3861497]);
// var b = new Bicicleta(2, 'Blanca', 'Ruta', [-34.596932,-58.3808287]);
// var c = new Bicicleta(3, 'Verde', 'Urbanas', [-34.603503, -58.378002]);

// Bicicleta.add(a);
// Bicicleta.add(b);
// Bicicleta.add(c);

module.exports = Bicicleta;