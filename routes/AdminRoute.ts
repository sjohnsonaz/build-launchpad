import Router, {route} from '../base/back/Router';

export default class AdminRoute extends Router {
    @route('get', '/')
    get(req, res, next) {
        res.render('admin/index', { title: 'Express' });
    }
}
