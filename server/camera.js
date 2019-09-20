'use strict';
const cp = require('child_process'),
  env = require('./environment');
let buf;

const getImage = () => new Promise((resolve, reject) => {
  let stdoutData = Buffer.alloc(0);
  const child = cp.spawn('raspistill');
  child
    .on('error', err => reject(err))
    .on('exit', (code, signal) => resolve(stdoutData));
  child.stdout.on('data', chunk => {
    stdoutData = Buffer.concat([stdoutData, chunk]);
  });
})
.then(newImageData => {
  buf = newImageData;
});

const startForeverLoop = () => {
  setTimeout(() => getImage().finally(() => startForeverLoop()), env.pictureInterval());
};

exports = module.exports = {
  getImage,
  startForeverLoop,
  imageBuffer: () => Buffer.from(buf),
};
