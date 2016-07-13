import Router, {route, middleware} from '../base/back/Router';
import CrudService from '../base/back/CrudService';

import AuthHelper from '../helpers/AuthHelper';
import UserGateway from '../gateways/UserGateway';

export default class UserService extends CrudService<UserGateway> {
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
