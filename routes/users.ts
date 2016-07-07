declare var module: any;

import * as express from 'express';

var router: express.Router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

export default router;
