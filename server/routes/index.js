'use strict';
const router = require('express').Router(),
  bb = require('bluebird'),
  cp = require('child_process'),
  thermals = require('../thermals');

router.get('/status', (req, res, next) =>  bb.all([thermals.criticalTemperature(), thermals.averageSystemTemperature()])
  .then(([criticalTemp, averageTemp]) => res.json({
    environment: process.env,
    temperature: {
      critical: {
        celsius: Math.round(criticalTemp),
        fahrenheit: Math.round(thermals.celsiusToFahrenheit(criticalTemp)),
      },
      average: {
        celsius: Math.round(averageTemp),
        fahrenheit: Math.round(thermals.celsiusToFahrenheit(averageTemp)),
      }
    },
  }))
  .catch(next));

router.post('/toggle-event', (req, res, next) => {
  cp.execFile('toggle-garage-door', err => err ? next(err) : res.sendStatus(204));
});

module.exports = router;
