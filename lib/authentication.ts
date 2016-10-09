import * as passport from 'passport';
import * as passportLocal from 'passport-local';

import config from '../config';

import UserGateway from '../implementations/gateways/UserGateway';

const userGateway = new UserGateway();
var LocalStrategy = passportLocal.Strategy;

export default function run(app) {
    passport.serializeUser(function(user, callback) {
        callback(undefined, user);
    });

    passport.deserializeUser(function(user, callback) {
        callback(undefined, user);
    });

    passport.use(new LocalStrategy(function(username, password, callback) {
        userGateway.login(username, password, callback);
    }));
}
