import * as express from 'express';
import * as passport from 'passport';

import UserGateway from '../gateways/UserGateway';
import AuthHelper from '../helpers/AuthHelper';

const router: express.Router = express.Router();

router.get('/', function(req, res, next) {
    res.json({
        loggedIn: !!req.user,
        username: req.user ? req.user.username : undefined
    });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    res.json(req.user);
});

router.post('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (!err) {
            res.json(true);
        } else {
            next(err);
        }
    });
});

router.post('/impersonate', AuthHelper.adminNotImpersonated, function(req, res, next) {
    UserGateway.getByUsername(req.body.username, function(err, user) {
        if (!err && user) {
            var adminUser = req.user;
            req.session.regenerate(function(err) {
                if (!err) {
                    (req.session as any).adminUser = adminUser;
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
});

router.post('/unimpersonate', AuthHelper.impersonated, function(req, res, next) {
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
});

export default router;
