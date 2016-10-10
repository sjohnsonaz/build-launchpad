var OAuthServer = require('express-oauth-server');

import OAuthModel from '../schemas/OAuthModel';

export default function(app) {
    app.oauth = OAuthServer({
        debug: true,
        model: OAuthModel
    });
}
