import * as express from 'express';

import Router, {route, middleware} from '../base/Router';

import AuthHelper from '../helpers/AuthHelper';
import UserGateway from '../gateways/UserGateway';

const userGateway = new UserGateway();

export class UserService extends Router {
    @route('get', '/:id')
    @middleware(AuthHelper.admin)
    get(req, res, next) {
        userGateway.get(req.params.id, function(err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result);
            }
        });
    }

    @route('get', '/')
    @middleware(AuthHelper.admin)
    list(req, res, next) {
        userGateway.list({
            find: {},
            select: undefined,
            page: req.query.page,
            pageSize: req.query.pageSize,
            sort: (function() {
                if (req.query.sortedColumn) {
                    var output = {};
                    output[req.query.sortedColumn] = (req.query.sortedDirection === undefined || req.query.sortedDirection) ? 1 : -1;
                    return output;
                }
            })()
        }, function(err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result);
            }
        });
    }

    @route('post', '/')
    @middleware(AuthHelper.admin)
    post(req, res, next) {
        userGateway.create(req.body, function(err, result) {
            if (err || !result) {
                return next(err);
            } else {
                res.json(result._id);
            }
        });
    }

    @route('put', '/:id')
    @middleware(AuthHelper.admin)
    put(req, res, next) {
        userGateway.update(req.params.id, req.body, function(err, affectedRows, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result.ok);
            }
        });
    }

    @route('delete', '/:id')
    @middleware(AuthHelper.admin)
    delete(req, res, next) {
        userGateway.delete(req.params.id, function(err) {
            if (err) {
                return next(err);
            } else {
                res.json(true);
            }
        });
    }
}

var service = new UserService();
export default service.expressRouter;
