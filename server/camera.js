'use strict';
const cp = require('child_process'),
  env = require('./environment'),
  moment = require('moment'),
  log = require('debug-logger')('camera');
let buf,
  lastRequest = moment();

const bump = () => {
  lastRequest = moment();
};

const getImage = () => new Promise((resolve, reject) => {
  bump();
  log.info('capturing photo');
  let stdoutData = Buffer.alloc(0);
  log.debug(`raspistill -o - -t ${env.captureTimeout()}`);
  const child = cp.spawn('raspistill', ['-o', '-', '-t', `${env.captureTimeout()}`]);
  child
    .on('error', err => reject(err))
    .on('exit', (code, signal) => resolve(stdoutData));
  child.stdout.on('data', chunk => {
    stdoutData = Buffer.concat([stdoutData, chunk]);
  });
})
.then(newImageData => {
  log.debug('captured image size', newImageData.length);
  buf = newImageData;
})
.catch(log.error);

const isIdle = () => moment().subtract(1, 'minutes').isBefore(lastRequest);

const pictureInterval = () => isIdle() ? env.pictureInterval() : env.idlePictureInterval();

const startForeverLoop = () => {
  log.info(`capturing image in ${pictureInterval()} milliseconds`);
  setTimeout(() => getImage().then(() => startForeverLoop()).catch(log.error), pictureInterval());
};



exports = module.exports = {
  bump,
  getImage,
  startForeverLoop,
  isIdle,
  pictureInterval,
  imageBuffer: () => {
    lastRequest = new Date();
    return Buffer.from(buf);
  },
};
