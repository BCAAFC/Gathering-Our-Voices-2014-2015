/**
 * Gathering Our Voices
 * @author Andrew Hobden <andrew@hoverbear.org>
 */
'use strict';

var async = require('async'),
    _     = require('lodash');

async.auto({
  environment: environment,
  // Database
  mongo:       ['environment', mongo],
  redis:       ['environment', redis],
  // httpd
  httpd:       ['environment', 'redis', httpd],
  routes:      ['httpd', routes]
}, complete);

function environment(callback) {
  if (process.env.SSL === undefined) {
    // Whether to use SSL. (NOTE: Don't use non-SSL in production)
    process.env.SSL = false;
    console.warn("$SSL not set, using insecure communication.");
  }
  if (process.env.PORT === undefined) {
    // The port to run on.
    process.env.PORT = 8080;
    console.warn('$PORT set to default: ' + process.env.PORT + '.');
  }
  if (process.env.SECRET === undefined) {
    // Cookie secret.
    process.env.SECRET = require('crypto').randomBytes(256);
    console.warn('$SECRET not set, generated one.');
  }
  if (process.env.ADMINS === undefined) {
    // Administrator emails, for elevated permissions.
    process.env.ADMINS = ['andrew@hoverbear.org'];
  }
  if (process.env.MONGO === undefined) {
    // MongoDB URI
    process.env.MONGO = process.env.MONGOLAB_URI || 'localhost/dev';
    console.warn('$MONGO set to default: ' + process.env.MONGO);
  }
  if (process.env.REDIS === undefined) {
    // Redis URI
    process.env.REDIS = process.env.REDISCLOUD_URL || 'localhost';
    console.warn('$REDIS set to default: ' + process.env.REDIS);
  }
  if (process.env.MANDRILL_APIKEY) {
    // Used for Mandrill, for mailing.
    console.warn('$MANDRILL_APIKEY not set. Expect errors on mailing.');
  }
  callback();
}

function mongo(callback, data) {
  var mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO, callback);
  callback(null, mongoose);
}

function redis(callback, data) {
  var uri = require('url').parse(process.env.REDIS),
      client = require('redis').createClient(uri.port || 6379, uri.hostname);
  if (uri.auth) {
    client.auth(uri.auth.split(':')[1]);
  }
  // Wait and pass along the client.
  client.on('ready', function () {
    callback(null, client);
  });
}

function httpd(callback, data) {
  var app = require('express')();
  // Ensure that requests that should be SSL use SSL.
  app.use(function ensureSecurity(req, res, next) {
    if (process.env.SSL && req.headers['x-forwarded-proto'] !== 'https' && req.hostname !== 'localhost') {
      res.redirect('https://' + req.hostname + req.url);
    } else {
      next();
    }
  });
  // Parsers for JSON/URL.
  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded({extended: true}));
  // Allow PUT/DELETE in forms.
  app.use(require('method-override')(function methodOverrider(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));
  app.use(require('cookie-parser')(process.env.SECRET));
  // Session handling.
  var session = require('express-session'),
      RedisStore = require('connect-redis')(session);
  app.use(require('express-session')({
    secret: process.env.SECRET,
    store: new RedisStore({client: data.redis}),
    resave: true,
    saveUninitialized: true
  }));
  // View engine
  app.set('views', './views');
  app.set('view engine', 'jade');
  // TODO: Improve/Remove this.
  app.use(function message(req, res, next) {
    if (req.query.message) {
      req.session.message = req.query.message;
    } else {
      req.session.message = null;
    }
    next();
  });
  app.use(require('express').static('./static', {maxAge: 86400000 * 4}));
  // Pass along the application.
  callback(null, app);
}

function routes(callback, data) {
  require('./routes')(data.httpd);
  data.httpd.use(function notFoundHandler(req, res) {
    res.status(404);
    console.warn('Page does not exist.');
    res.send('This page does not exist.');
  });
  callback(null);
}

function complete(error, data) {
  if (error) {
    console.error("There was an error.");
    console.error(error);
    return;
  } else {
    data.httpd.listen(process.env.PORT, function allDone() {
      console.log("Listening on port " + process.env.PORT);
    });
  }
}
