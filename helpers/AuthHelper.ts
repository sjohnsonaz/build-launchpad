export default class AuthHelper {
    static loggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            throw 'forbidden';
        }
    }

    static loggedInRest(req, res, next) {
        if (req.user) {
            next();
        } else {
            throw 'forbidden';
        }
    }

    static admin(req, res, next) {
        var user = req.user;
        if (user && user.role === 'admin') {
            next();
        } else {
            throw 'forbidden';
        }
    }

    static adminNotImpersonated(req, res, next) {
        var user = req.user;
        var adminUser = req.session.adminUser;
        if (user && user.role === 'admin' && !adminUser) {
            next();
        } else {
            throw 'forbidden';
        }
    }

    static impersonated(req, res, next) {
        var user = req.session.adminUser;
        if (user && user.role === 'admin') {
            next();
        } else {
            throw 'forbidden';
        }
    }

    static roles(roles) {
        if (roles) {
            if (!(roles instanceof Array)) {
                roles = [roles];
            }
        } else {
            roles = [];
        }
        return function(req, res, next) {
            var user = req.user;
            if (user && roles.indexOf(user.role) != -1) {
                next();
            } else {
                throw 'forbidden';
            }
        };
    }
}
