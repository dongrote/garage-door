'use strict';
const _ = require('lodash');

exports = module.exports = {
  port: () => Number(_.get(process.env, 'PORT', 3000)),
  pictureInterval: () => Number(_.get(process.env, 'CAMERA_INTERVAL_SECONDS', 10)) * 1000,
};
