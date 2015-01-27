/**
 * Gathering Our Voices
 * @author Andrew Hobden <andrew@hoverbear.org>
 */
'use strict';

var async = require('async'),
    _     = require('lodash');

async.auto({
    environment : environment,
    // Database
    mongo       : ['environment', mongo],
    redis       : ['environment', redis],
    flags       : ['environment', 'mongo', flags],
    // httpd
    httpd       : ['environment', 'redis', httpd],
    routes      : ['httpd', 'flags', routes]
}, complete);

/**
 * Checks the environment for various settings and sets some defaults if none
 * are present.
 * @param  {Function} callback The callback for `async.auto`.
 */
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
        process.env.SECRET = "I'm insecure!";
        console.warn('$SECRET not set, used INSECURE default.');
    }
    if (process.env.ADMINS === undefined) {
        // Administrator emails, for elevated permissions.
        process.env.ADMINS = ['andrew@hoverbear.org'];
    }
    if (process.env.MONGO === undefined) {
        // MongoDB URI
        if (process.env.NODE_ENV === 'testing') {
            process.env.MONGO = process.env.MONGOLAB_URI || 'localhost/testing';
        } else {
            process.env.MONGO = process.env.MONGOLAB_URI || 'localhost/dev';
        }
        console.warn('$MONGO set to default: ' + process.env.MONGO);
    }
    if (process.env.REDIS === undefined) {
        // Redis URI
        process.env.REDIS = process.env.REDISCLOUD_URL || 'localhost';
        console.warn('$REDIS set to default: ' + process.env.REDIS);
    }
    if (process.env.MANDRILL_APIKEY === undefined) {
        // Used for Mandrill, for mailing.
        console.warn('$MANDRILL_APIKEY not set. Expect errors on mailing.');
    }
    if (process.env.MAX_YOUTH === undefined) {
        // Used to determine if we should allow more registrants.
        process.env.MAX_YOUTH = 1000;
        console.warn("$MAX_YOUTH not set, setting to default: " + process.env.MAX_YOUTH);
    }
    callback();
}

/**
 * Connects to the MongoDB server specified by the environment.
 * Depends on: `environment`
 * @param  {Function} callback The callback for `async.auto`.
 * @param  {Object}   data     `async.auto`'s data object.
 */
function mongo(callback, data) {
    var mongoose = require('mongoose');
    // Wait for a connection then invoke the task callback.
    mongoose.connect(process.env.MONGO, callback);
}

/**
 * Connects to the Redis server specified by the environment.
 * Depends on: `environment`
 * @param  {Function} callback The callback for `async.auto`.
 * @param  {Object}   data     `async.auto`'s data object.
 */
function redis(callback, data) {
    var uri    = require('url').parse(process.env.REDIS),
        client = require('redis').createClient(uri.port || 6379, uri.hostname);
    if (uri.auth) {
        client.auth(uri.auth.split(':')[1]);
    }
    // Wait and pass along the client.
    client.on('ready', function () {
        console.log('Connected to redis');
        callback(null, client);
    });
}

/**
 * Persisted flags for the application.
 * Depends on: 'environment', 'mongo'
 * @param  {Function} callback The callback for `async.auto`
 * @param  {Object}   data     `async.auto`'s data object.
 */
function flags(callback, data) {
    var Flag = require('./schema/Flag');
    Flag.find().exec(function (error, theFlags) {
        var flags = {};
        _.each(theFlags, function (val) {
            flags[val.key] = val.value;
        });
        callback(error, flags);
    });
}

/**
 * Sets up the express httpd.
 * Depends on: `environment`, `redis`
 * @param  {Function} callback The callback for `async.auto`.
 * @param  {Object}   data     `async.auto`'s data object.
 */
function httpd(callback, data) {
    var server = require('express')();
    // Ensure that requests that should be SSL use SSL.
    server.use(function ensureSecurity(req, res, next) {
        // This detects if the original request (prior to Heroku's forwarding) was SSL based.
        // If the requests aren't from localhost (eg. For development) it redirects them to the HTTPS site.
        if (process.env.SSL && req.headers['x-forwarded-proto'] !== 'https' && req.hostname !== 'localhost') {
            res.redirect('https://' + req.hostname + req.url);
        } else {
            next();
        }
    });
    // Favicon
    server.use(require('serve-favicon')('./static/favicon.ico'));
    // Parsers for JSON/URL encoding.
    server.use(require('body-parser').json());
    server.use(require('body-parser').urlencoded({extended: true}));
    // Multipart form handling, for image uploads.
    server.use(require('multer')());
    // Allow PUT/DELETE in forms.
    server.use(require('method-override')(function methodOverrider(req, res) {
        // Just include a `_method` input on a form with the method you want.
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));
    // server.use(require('cookie-parser')(process.env.SECRET));
    // Session handling.
    var session = require('express-session'),
        RedisStore = require('connect-redis')(session);
    server.use(require('express-session')({
        secret            : process.env.SECRET,
        store             : new RedisStore({
            client: data.redis,
            ttl: 60*60*8 // 8 hours
        }),
        resave            : true,
        saveUninitialized : true,
        secure            : true
    }));
    // View engine
    server.set('views', './views');
    server.set('view engine', 'jade');
    // Some pages pass along messages, which get dumped into the template.
    server.use(function message(req, res, next) {
        if (req.query.message) {
            req.session.message = req.query.message;
        } else {
            req.session.message = null;
        }
        next();
    });
    // Static items in `./static` are mapped as routes on `/`.
    server.use(require('express').static('./static', {maxAge: 86400000 * 4}));
    // Pass along the application.
    callback(null, server);
}

/**
 * Sets up routing for the httpd server.
 * Depends on: `httpd`
 * @param  {Function} callback The callback for `async.auto`.
 * @param  {Object}   data     `async.auto`'s data object.
 */
function routes(callback, data) {
    // The different route modules used.
    _(['account', 'admin', 'general', 'member', 'payment', 'workshop', 'facilitator'])
        .each(function (val) {
            data.httpd.use(require('./routes/' + val)(data));
        });
    // If any 404 not founds prop up, handle them and log.
    data.httpd.use(function notFoundHandler(req, res) {
        res.status(404);
        console.warn('Path `' + req.originalUrl + '`does not exist.');
        res.send('Path `' + req.originalUrl + '`does not exist.');
    });
    callback(null);
}

/**
 * Completes the startup. Handles any errors and starts listening.
 * @param  {Error}  error Any errors risen by the dependant tasks.
 * @param  {Object} data  The finished, full, data object.
 */
function complete(error, data) {
    if (error) {
        console.error("There was an error.");
        console.error(error);
        return;
    } else {
        once();
        data.httpd.listen(process.env.PORT, function allDone() {
            console.log("Listening on port " + process.env.PORT);
        });
    }
}
//
function once() {
    var Group = require('./schema/Group');
    Group.find({}).exec(function (err, data) {
        if (!err && data) {
            async.each(data, function (group, cb) {
                console.log('Processing group ' + group.affiliation);
                group._state.waitlist = 0;
                group.save(cb);
            }, function done(err) {
                console.log('All done mapping.');
            });
        }
    });
}
