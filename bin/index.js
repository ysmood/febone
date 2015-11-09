#!/usr/bin/env node

var kit = require('nokit');

kit.spawn(
    kit.path.resolve(require.resolve('nokit'), '../../../.bin/no'),
    process.argv.slice(2).concat(['--nofile', kit.path.join(__dirname, '/../nofile.js')])
);
