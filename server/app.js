'use strict';
const _ = require('lodash'),
  express = require('express'),
  log = require('debug-logger')('app'),
  logger = require('morgan'),
  router = require('./routes'),
  app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);
app.use((req, res, next) => next(new HttpError(404)));
app.use((err, req, res, next) => {
  log.error(err);
  res.status(_.get(err, 'statusCode', 500)).json(app.get('env') === 'production'
    ? {error: {message: err.message}}
    : {error: {message: err.message, stack: err.stack}});
});

exports = module.exports = app;
