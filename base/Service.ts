import * as express from 'express';

import Router, {route, middleware} from './Router';
import Gateway from './Gateway';
import AuthHelper from '../helpers/AuthHelper';

export default class Service<T extends Gateway<any>> extends Router {
    gateway: T
    constructor(gateway: T) {
        super();
        this.gateway = gateway;
    }

    @route('get', '/:id')
    @middleware(AuthHelper.admin)
    get(req, res, next) {
        this.gateway.get(req.params.id, function(err, result) {
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
        console.log(this);
        this.gateway.list({
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
        this.gateway.create(req.body, function(err, result) {
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
        this.gateway.update(req.params.id, req.body, function(err, affectedRows, result) {
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
        this.gateway.delete(req.params.id, function(err) {
            if (err) {
                return next(err);
            } else {
                res.json(true);
            }
        });
    }
}