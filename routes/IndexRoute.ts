import Router, {route} from '../base/back/Router';

export default class IndexRoute extends Router {
    @route()
    get(id) {
        res.render('index', { title: 'Express', id: id });
    }

    @route('get', '/')
    list() {
        res.render('index', { title: 'Express', id: 'none' });
    }
}
