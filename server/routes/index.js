'use strict';
const router = require('express').Router(),
  bb = require('bluebird'),
  thermals = require('../thermals');

router.get('/status', (req, res, next) =>  bb.all([thermals.criticalTemperature(), thermals.averageSystemTemperature()])
  .then(([criticalTemp, averageTemp]) => res.json({
    environment: process.env,
    temperature: {
      critical: {
        celsius: criticalTemp,
        fahrenheit: thermals.celsiusToFahrenheit(criticalTemp),
      },
      average: {
        celsius: averageTemp,
        fahrenheit: thermals.celsiusToFahrenheit(averageTemp),
      }
    },
  }))
  .catch(next));

module.exports = router;
