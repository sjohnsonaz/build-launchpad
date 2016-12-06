import * as express from 'express';
import * as passport from 'passport';

import {route, middleware} from '../base/back/Router';
import Service from '../base/back/Service';

import UserGateway from '../implementations/gateways/UserGateway';
import AuthHelper from '../helpers/AuthHelper';

export default class AuthService extends Service<UserGateway> {
    @route('get', '/', false)
    get(req, res, next) {
        res.json({
            loggedIn: !!req.user,
            username: req.user ? req.user.username : undefined
        });
    }

    @route('post', '/login', false)
    @middleware(passport.authenticate('local'))
    login(req, res, next) {
        res.json(req.user);
    }

    @route('post', '/logout', false)
    logout(req, res, next) {
        req.session.destroy(function(err) {
            if (!err) {
                res.json(true);
            } else {
                next(err);
            }
        });
    }

    @route('post', '/impersonate', false)
    @middleware(AuthHelper.adminNotImpersonated)
    impersonate(req, res, next) {
        this.gateway.getByUsername(req.body.username, function(err, user) {
            if (!err && user) {
                var adminUser = req.user;
                req.session.regenerate(function(err) {
                    if (!err) {
                        req.session.adminUser = adminUser;
                        req.logIn(user, function(err) {
                            if (err) {
                                return next(err);
                            } else {
                                res.json(user);
                            }
                        });
                    } else {
                        return next(err);
                    }
                });
            } else {
                return next(err);
            }
        });
    }

    @route('post', '/unimpersonate', false)
    @middleware(AuthHelper.impersonated)
    unimpersonate(req, res, next) {
        var adminUser = (req.session as any).adminUser;
        req.session.regenerate(function(err) {
            if (err) {
                return next(err);
            } else {
                req.logIn(adminUser, function(err) {
                    if (err) {
                        return next(err);
                    } else {
                        res.json(adminUser);
                    }
                });
            }
        });
    }
}
