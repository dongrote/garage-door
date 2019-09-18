'use strict';
const bb = require('bluebird'),
  sensorFilePaths = require('./sensorFilePaths'),
  readTemperature = require('./readTemperature');

exports = module.exports = () => bb.map(sensorFilePaths(), readTemperature);
