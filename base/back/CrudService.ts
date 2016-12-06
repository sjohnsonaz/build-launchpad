import {route, middleware} from './Router';
import Service from './Service';
import Gateway from './Gateway';
import AuthHelper from '../../helpers/AuthHelper';

export default class CrudService<T extends Gateway<any>> extends Service<T> {
    constructor(gateway: T) {
        super(gateway);
    }

    @route('get', '/:id', false)
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

    @route('get', '/', false)
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

    @route('post', '/', false)
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

    @route('put', '/:id', false)
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

    @route('delete', '/:id', false)
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
