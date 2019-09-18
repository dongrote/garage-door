'use strict';
const fs = require('fs'),
  path = require('path'),
  methods = {};

fs.readdirSync(__dirname)
  .filter(fname => fname.endsWith('.js') && fname !== 'index.js')
  .map(fname => path.basename(fname, '.js'))
  .forEach(fname => {
    methods[fname] = require(`./${fname}`);
  });

exports = module.exports = methods;
