'use strict';

const { program } = require('commander');
program.version('0.0.1');

program
    .description('Generate Secret Key in console')
    .requiredOption('-l, --length <number>', 'provide the required key length (bytes)', parseInt)

program.parse(process.argv);
const options = program.opts();

const mySecretKey = require('crypto').randomBytes(options.length).toString('hex');
console.log(mySecretKey);