import Router, {route} from '../base/back/Router';

export default class UserRoute extends Router {
    @route('get', '/')
    get(req, res, next) {
        res.send('respond with a resource');
    }
}
