'use strict';
const cp = require('child_process'),
  env = require('./environment'),
  log = require('debug-logger')('camera');
let buf;

const getImage = () => new Promise((resolve, reject) => {
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

const startForeverLoop = () => {
  log.info(`capturing image in ${env.pictureInterval()} milliseconds`);
  setTimeout(() => getImage().then(() => startForeverLoop()).catch(log.error), env.pictureInterval());
};

exports = module.exports = {
  getImage,
  startForeverLoop,
  imageBuffer: () => Buffer.from(buf),
};
