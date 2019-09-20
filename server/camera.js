'use strict';
const cp = require('child_process'),
  env = require('./environment'),
  log = require('debug-logger')('camera');
let buf;

const getImage = () => new Promise((resolve, reject) => {
  log.info('capturing photo');
  let stdoutData = Buffer.alloc(0);
  const child = cp.spawn('raspistill', ['-o', '-', '-t', '2000']);
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
  setTimeout(() => getImage().finally(() => startForeverLoop()), env.pictureInterval());
};

exports = module.exports = {
  getImage,
  startForeverLoop,
  imageBuffer: () => Buffer.from(buf),
};
