import Router, {route} from '../base/back/Router';

export default class IndexRoute extends Router {
    @route('get', '/')
    get(req, res, next) {
        res.render('index', { title: 'Express' });
    }
}
