//import * as routie from 'routie';
import Router from './Router';

export default class Routing {
    static run() {
        var router = new Router({
            'user': [
                function(id, name) {
                    console.log('Route \'user/:id/:name\' ' + id + ', ' + name);
                },
                function(id) {
                    console.log('Route \'user/:id\' ' + id);
                },
                {
                    'create': function(info) {
                        console.log('Route \'user/create/:info\' ' + info);
                    }
                }
            ],
            '': function() {
                console.log('Route \'\'');
            }
        });
        router.listen();
    }
}
