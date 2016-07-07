import * as express from 'express';

import AuthHelper from '../helpers/AuthHelper';
import UserGateway from '../gateways/UserGateway';

const router: express.Router = express.Router();

router.get('/:id', AuthHelper.admin, function(req, res, next) {
    UserGateway.get(req.params.id, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.json(result);
        }
    });
});

router.get('/', AuthHelper.admin, function(req, res, next) {
    UserGateway.list({
        find: {},
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
});

router.post('/', AuthHelper.admin, function(req, res, next) {
    UserGateway.create(req.body, function(err, result) {
        if (err || !result) {
            return next(err);
        } else {
            res.json(result._id);
        }
    });
});

router.put('/:id', AuthHelper.admin, function(req, res, next) {
    UserGateway.update(req.params.id, req.body, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.json(result.ok);
        }
    });
});

router.delete('/:id', AuthHelper.admin, function(req, res, next) {
    UserGateway.delete(req.params.id, function(err, result) {
        if (err) {
            return next(err);
        } else {
            res.json(true);
        }
    });
});

export default router;
