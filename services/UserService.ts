import * as express from 'express';

import Router, {route, middleware} from '../base/back/Router';
import Service from '../base/back/Service';

import AuthHelper from '../helpers/AuthHelper';
import UserGateway from '../gateways/UserGateway';

export class UserService extends Service<UserGateway> {
    @route('get', 'test/:id')
    @middleware(AuthHelper.admin)
    test(req, res, next) {
        this.gateway.get(req.params.id, function(err, result) {
            if (err) {
                return next(err);
            } else {
                res.json(result);
            }
        });
    }
}

const userGateway = new UserGateway();
var service = new UserService(userGateway);
export default service.expressRouter;
