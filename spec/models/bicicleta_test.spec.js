var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', () => {
    beforeEach((done) => {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {
            useNewUrlParser: true
        });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', () => {
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach((done) => {
        Bicicleta.deleteMany({}, (err, success) => {
            if (err) console.log(err);
            done();
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        })
    })
    describe('Bicicleta.allBicis', () => {
        it("comienza vacia", (done) => {
            Bicicleta.allBicis((err, bicis) => {
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });
    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({
                code: 1,
                color: "verde",
                modelo: "urbana"
            });
            Bicicleta.add(aBici, (err, newBici) => {
                if (err) console.log(err);
                Bicicleta.allBicis((err, bicis) => {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                });
            });
            describe('Bicicleta.findByCode', () => {
                it('debe devolver la bici con code 1', (done) => {
                    Bicicleta.allBicis((err, bicis) => {
                        expect(bicis.length).toBe(0);

                        var aBici = new Bicicleta({
                            code: 1,
                            color: 'verde',
                            modelo: 'urbana'
                        });
                        Bicicleta.add(aBici, (err, newBici) => {
                            if (err) console.log(err);

                            var aBici2 = new Bicicleta({
                                code: 2,
                                color: 'roja',
                                modelo: 'urbana'
                            });
                            Bicicleta.add(aBici2, (err, newBici) => {
                                if (err) console.log(err);
                                Bicicleta.findByCode(1, (err, targetBici) => {
                                    expect(targetBici.code).toBe(aBici.code);
                                    expect(targetBici.color).toBe(aBici.color);
                                    expect(targetBici.modelo).toBe(aBici.modelo);

                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
})

// describe('Bicicleta.removeById', () =>{
//     it('Debe eliminar la bici con id 1', () =>{
//         expect(Bicicleta.allBicis.length).toBe(0)