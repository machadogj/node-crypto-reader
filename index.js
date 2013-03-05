
/**
 * module dependencies
 */

var fs     = require('fs'),
    crypto = require('crypto'),
    async  = require('async');


/**
 * createCredentials - Creates the crypto credentials based on the cert, key
 * and ca.
 * @api private
 */

function createCredentials(conf, cb) {
    try
    {
        cb(null, crypto.createCredentials(conf));
    }
    catch(e)
    {
        cb(e);
    }
}

/**
 * read - reads the crt, key and ca chain and creates crypto credentials.
 *
 * @param cert {object} - crt, key & ca.
 * @returns {credentials}
 * @api private
 */

function read( opts, cb ) {

    var credentials = {};

    if (!opts) return cb('opts is required');
    if (!opts.crt) return cb('opts.crt is required');
    if (!opts.key) return cb('opts.key is required');

    //read the cert.
    fs.readFile(opts.crt, function ( err, data ) {

        if (err) {
            var report = new Error('unable to read crt file: ' + opts.crt);
            report.inner = err;
            return cb(report);
        }

        credentials.cert = data;
        
        //read the cert key.
        fs.readFile(opts.key, function ( err, data ) {

            if (err) {
                var report = new Error('unable to read key file: ' + opts.key);
                report.inner = err;
                return cb(report);
            }

            credentials.key = data;

            //read the CA if it has.
            if (!opts.ca) {
                
                createCredentials(credentials, cb);
                return;

            } else {

                var chain = Array.isArray(opts.ca) ? opts.ca : [ opts.ca ];
                credentials.ca = [];

                async.each(chain, function ( ca, next ){


                    
                    fs.readFile(ca, function ( err, data ) {

                        if (err) {
                            var report = new Error('unable to read ca file: ' + opts.ca);
                            report.inner = err;
                            return next(report);
                        }

                        credentials.ca.push(data);
                        next();
                        

                    });
                }, function ( err ) {

                    if (err) return cb(err);

                    createCredentials(credentials, cb);
                });
                    
            }
        });
    });
}

/**
 * module exports
 */

module.exports = read;