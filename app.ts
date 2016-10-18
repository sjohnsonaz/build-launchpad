declare var __dirname: any;

import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as session from 'express-session';
import * as passport from 'passport';
import * as connectMongo from 'connect-mongo';
import * as mongoose from 'mongoose';

var MongoStore = connectMongo(session);

import authentication from './lib/authentication';
import routing from './lib/routing';
import handlebars from './lib/handlebars';

import config from './config';

mongoose.connect(config.mongodb.uri, config.mongodb.options, function(err) {
    if (err) {
        console.log('ERROR connecting to: ' + config.mongodb.uri + '. ' + err);
    } else {
        console.log('Succeeded connected to: ' + config.mongodb.uri);
    }
});

var app = express();
app.locals.config = config;
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, config.viewsPath));
var hbs = handlebars(app);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: config.mongodb.session.secret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    resave: config.mongodb.session.resave,
    saveUninitialized: config.mongodb.session.saveUninitialized,
    store: new MongoStore({
        url: config.mongodb.uri,
        collection: config.mongodb.session.collection
    })
}));
authentication(app);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, config.publicPath)));

// Inject session into response
app.use(function(req, res, next) {
    res.locals.session = req.session;
    //res.locals.sessionUser = req.user;
    next();
});

routing(app);

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
    var err: any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        if (res.locals.isService) {
            res.json({
                message: err.message,
                error: err,
                stack: err.stack
            });
        } else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    if (res.locals.isService) {
        res.json({
            message: err.message,
            error: err
        });
    } else {
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

module.exports = app;
