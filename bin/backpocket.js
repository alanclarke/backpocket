#!/usr/bin/env node

var backpocket = require('../lib/backpocket.js');

console.assert(process.argv.length>=3, 'no arguments passed to backpocket, minium required is source and destination');


var opts = backpocket.getargs(process.argv);

backpocket(opts.src, opts.dest, opts, function(){
	process.exit();
});