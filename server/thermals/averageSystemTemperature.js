'use strict';
const _ = require('lodash'),
  systemTemperatures = require('./systemTemperatures');

exports = module.exports = () => systemTemperatures().then(temps => _.mean(temps));
