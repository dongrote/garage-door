'use strict';
const fs = require('fs-extra');

exports = module.exports = fpath => fs.readFile(fpath)
  .then(data => Number(data.toString()) / 1000);
