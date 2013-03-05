var cryptoReader = require('../index'),
    assert       = require('assert'),
    path         = require('path'),
    certFolder   = path.join(__dirname, 'cert'),
    certPath     = path.join(certFolder, 'hosta.crt'),
    keyPath      = path.join(certFolder, 'hosta.key'),
    caPath       = path.join(certFolder, 'ca.crt');

describe("crypto-reader", function () {

    it("should return error if options is empty", function ( done ) {

        cryptoReader(null, function ( err ) {

            assert.ok(err);
            assert.equal('opts is required', err);
            done();
        });
    });

    it("should return error if crt is not defined.", function ( done ) {

        cryptoReader({}, function ( err ) {

            assert.ok(err);
            assert.equal('opts.crt is required', err);
            done();
        });
    });

    it("should return error if key is not defined", function ( done ) {

        cryptoReader({ crt: 'foo.pem'}, function ( err ) {

            assert.ok(err);
            assert.equal('opts.key is required', err);
            done();
        });
    });

    it("should return error if cert file does not exist", function ( done ) {

        var invalidCertPath = certPath + '.invalid';
        cryptoReader({ crt: invalidCertPath, key: keyPath}, function ( err ) {

            assert.ok(err);
            assert.equal('unable to read crt file: ' + invalidCertPath, err.message);
            done();
        });
    });

    it("should return error if key file does not exist", function ( done ) {

        var invalidKeyPath = keyPath + '.invalid';
        cryptoReader({ crt: certPath, key: invalidKeyPath}, function ( err ) {

            assert.ok(err);
            assert.equal('unable to read key file: ' + invalidKeyPath, err.message);
            done();
        });
    });

    it("should create creadentials", function ( done ) {

        cryptoReader({ crt: certPath, key: keyPath}, function (err, cred) {

            assert.ok(!err);
            assert.ok(cred);
            done();
        });
    });

    it("should accept a single ca file", function ( done ) {

        var options = { crt: certPath, key: keyPath, ca: caPath }; 
        cryptoReader( options, function ( err, cred ) {

            assert.ok(!err);
            assert.ok(cred);
            done();
        });
    });

    it("should return error if single ca file does not exist", function ( done ) {

        var invalidCaPath = caPath + '.invalid',
            options = { crt: certPath, key: keyPath, ca: invalidCaPath };

        cryptoReader(options, function ( err ) {

            assert.ok(err);
            assert.equal('unable to read ca file: ' + invalidCaPath, err.message);
            done();
        });
    });

    it("should accept an array of certs for ca", function ( done ) {

        var options = { crt: certPath, key: keyPath, ca: [ caPath ]};

        cryptoReader(options, function ( err, cred ) {

            assert.ok(!err);
            assert.ok(cred);
            done();
        });
    });
});


