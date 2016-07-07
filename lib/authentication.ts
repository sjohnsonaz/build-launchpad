import path from 'path';
import crypto from 'crypto';

import passport from 'passport';
import passportLocal from 'passport-local';

import config from '../config';

import UserGateway from '../gateways/UserGateway';

var LocalStrategy = passportLocal.Strategy;

export default function run(app) {
    passport.serializeUser(function(user, callback) {
        callback(undefined, user);
    });

    passport.deserializeUser(function(user, callback) {
        callback(undefined, user);
    });

    passport.use(new LocalStrategy(function(username, password, callback) {
        UserGateway.login(username, password, callback);
    }));
}
