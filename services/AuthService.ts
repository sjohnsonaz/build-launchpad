import * as express from 'express';
import * as passport from 'passport';

import Router, {route, middleware} from '../base/back/Router';

import UserGateway from '../gateways/UserGateway';
import AuthHelper from '../helpers/AuthHelper';

const userGateway = new UserGateway();

export class AuthService extends Router {
    @route('get', '/')
    get(req, res, next) {
        res.json({
            loggedIn: !!req.user,
            username: req.user ? req.user.username : undefined
        });
    }

    @route('post', '/login')
    @middleware(passport.authenticate('local'))
    login(req, res, next) {
        res.json(req.user);
    }

    @route('post', '/logout')
    logout(req, res, next) {
        req.session.destroy(function(err) {
            if (!err) {
                res.json(true);
            } else {
                next(err);
            }
        });
    }

    @route('post', '/impersonate')
    @middleware(AuthHelper.adminNotImpersonated)
    impersonate(req, res, next) {
        userGateway.getByUsername(req.body.username, function(err, user) {
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

    @route('post', '/unimpersonate')
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

var service = new AuthService();
export default service.expressRouter;
