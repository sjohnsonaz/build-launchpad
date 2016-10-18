//import * as routie from 'routie';
import Router from './Router';

export default class Routing {
    static run() {
        var router = new Router({
            'user/:id/:name': function(id, name) {
                console.log('Route \'user/:id/:name\' ' + id + ', ' + name);
            },
            'user/:id': function(id) {
                console.log('Route \'user/:id\' ' + id);
            },
            '': function() {
                console.log('Route \'\'');
            }
        });
        router.listen();
    }
}
