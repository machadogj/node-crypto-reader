node-crypto-reader
==================

helper for creating crypto credentials based on cert files.

##Installation

	npm install crypto-reader

##Usage

	var cryptoReader = require('crypto-reader');

	var options = { crt: certPath, key: keyPath, ca: caPath };
	
	cryptoReader( options, function ( err, cred ) {
		//use cred here.
	});

For more samples of usage, checkout `./test/index.js` file.

##Running tests

	mocha

