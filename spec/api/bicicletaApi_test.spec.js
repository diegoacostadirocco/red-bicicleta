var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www'); 
const { base } = require('../../models/bicicleta');

var base_url = 'http://localhost:5000/api/bicicletas'

describe('Bicicleta API', () =>{
    beforeEach((done) =>{
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', () => {
            console.log('We are connected to test database!');
            done();
        });
    })

    afterEach((done) =>{
        Bicicleta.deleteMany({}, (err, success) =>{
            if (err) console.log(err);
            done();
        })
    })
    describe('GET BICICLETAS /', () =>{
        it('Status 200', (done) =>{
            request.get(base_url, (err, response, body) =>{
                var result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
                done();
            });
            
        });
    });

    describe('POST BICICLETAS /create', () =>{
        it('Status 200', (done) =>{
            var headers = {'content-type' : 'application/json'};
            var aBici = '{ "id":10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54 }';
        
            request.post({
                    headers:headers,
                    url: `${base_url}/create`,
                    body: aBici
            }, (err, response, body) =>{
                    expect(response.statusCode).toBe(200);
                    var bici = JSON.parse(body).bicicleta;
                    console.log(bici);
                    expect(bici.color).toBe("rojo");
                    expect(bici.ubicacion[0]).toBe(-34);
                    expect(bici.ubicacion[1]).toBe(-54);
                    done();
            });
    
        });
    });

    describe('PUT BICICLETAS /update', () => {
        it('STATUS 200', (done) => {
            var headers = {'Content-Type': 'application/json'};

            var a = new Bicicleta(20, 'rojo', 'urbana', [-19.035444, -65.273607]);
            Bicicleta.add(a);

            var aBici = { "id": 20, "color": "rojito", "modelo": "urbana", "lat": -54.36, "lng": -74.35 }; //Datos a actualizar

            const options = {
                url: URL + '/update',
                headers: headers,
                json: true,
                body: aBici
            };
            
            request.put(options, (err, response, body) => {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(20).color).toBe("rojito");
                done();
            }); 

        });
    });

    describe('DELETE BICICLETAS /delete', () => {
        it('STATUS 204', (done) => {
            var headers = {'Content-Type': 'application/json'};

            var a = new Bicicleta(30, 'rojo', 'urbana', [-19.035444, -65.273607]);
            Bicicleta.add(a);

            var aBici = { "id": 30  }; //Dato a borrar

            const options = {
                url: URL + '/delete',
                headers: headers,
                json: true,
                body: aBici
            };
            
            request.delete(options, (err, response, body) => {
                expect(response.statusCode).toBe(204);
                done();
            }); 

        });
    });
    
});