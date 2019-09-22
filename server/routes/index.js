'use strict';
const _ = require('lodash'),
  env = require('../environment'),
  router = require('express').Router(),
  bb = require('bluebird'),
  cp = require('child_process'),
  camera = require('../camera'),
  thermals = require('../thermals');

router.get('/status', (req, res, next) =>  bb.all([thermals.criticalTemperature(), thermals.averageSystemTemperature()])
  .then(([criticalTemp, averageTemp]) => res.json({
    environment: _.mapValues(env, v => v()),
    temperature: {
      critical: {
        celsius: Math.round(criticalTemp),
        fahrenheit: Math.round(thermals.celsiusToFahrenheit(criticalTemp)),
      },
      average: {
        celsius: Math.round(averageTemp),
        fahrenheit: Math.round(thermals.celsiusToFahrenheit(averageTemp)),
      },
      camera: {
        isIdle: camera.isIdle(),
        pictureInterval: camera.pictureInterval(),
      },
    },
  }))
  .catch(next));

router.post('/toggle-event', (req, res, next) => {
  cp.execFile('toggle-garage-door', err => err ? next(err) : res.sendStatus(204));
});

router.get('/picture', (req, res, next) => {
  res.set('Content-Type', 'image/jpeg; charset=binary');
  res.send(camera.imageBuffer());
});

module.exports = router;
