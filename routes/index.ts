declare var module: any;

import * as express from 'express';

var router: express.Router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

export default router;
