import {route, middleware} from './Router';
import Service from './Service';
import Gateway from './Gateway';
import AuthHelper from '../../helpers/AuthHelper';

export default class CrudService<T extends Gateway<any>> extends Service<T> {
    constructor(gateway: T) {
        super(gateway);
    }

    @route()
    @middleware(AuthHelper.admin)
    get(id: string) {
        this.gateway.get(id, function(err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result);
            }
        });
    }

    @route(undefined, undefined, false)
    @middleware(AuthHelper.admin)
    list(page: number, pageSize: number, sortedColumn: string, sortedDirection: number) {
        console.log(this);
        this.gateway.list({
            find: {},
            select: undefined,
            page: page,
            pageSize: pageSize,
            sort: (function() {
                if (sortedColumn) {
                    var output = {};
                    output[sortedColumn] = (sortedDirection === undefined || sortedDirection) ? 1 : -1;
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

    @route()
    @middleware(AuthHelper.admin)
    post() {
        this.gateway.create(req.body, function(err, result) {
            if (err || !result) {
                return next(err);
            } else {
                res.json(result._id);
            }
        });
    }

    @route()
    @middleware(AuthHelper.admin)
    put(id: string) {
        this.gateway.update(id, req.body, function(err, affectedRows, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result.ok);
            }
        });
    }

    @route()
    @middleware(AuthHelper.admin)
    delete(id: string) {
        this.gateway.delete(id, function(err) {
            if (err) {
                return next(err);
            } else {
                res.json(true);
            }
        });
    }
}
