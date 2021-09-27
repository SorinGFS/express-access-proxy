'use strict';
// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

const fs = require('../../../base/fs');
const npm = require('npm');
const { program } = require('commander');
program.version('0.0.1');

program
    .description('Access Proxy Plugin Uninstaller.')
    .requiredOption('-p, --provider-name <string>', 'provider-name arg as required in auth.provider.name')
    .option('-v, --provider-version <semantic version string>', 'provider-version arg as required in npm install ${provider-name}-access-proxy@provider-version, if any');

program.parse(process.argv);
const options = program.opts();

const providerName = options.providerName;
const provider = options.providerVersion ? `${providerName}-access-proxy@${options.providerVersion}` : `${providerName}-access-proxy`;
const pathResolveArgs = ['server', 'proxy', providerName];

console.log(`Uninstalling Access Proxy Plugin ${providerName.toUpperCase()}...`);

npm.load((error) => {
    if (error) return console.log(error);
    npm.commands.uninstall([provider], (error, data) => {
        if (error) return console.log(error);
        // command succeeded, and data might have some info
    });
    npm.on('log', (message) => {
        console.log(message);
    });
});

fs.removeDir(...pathResolveArgs);
