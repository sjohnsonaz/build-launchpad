import ServiceHelper from '../helpers/ServiceHelper';

import IndexRoute from '../routes/IndexRoute';
import UserRoute from '../routes/UserRoute';

import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export default function run(app) {
    app.use('/api/auth', ServiceHelper.isService, AuthService);
    app.use('/api/user', ServiceHelper.isService, UserService);

    app.use('/user', UserRoute);
    app.use('/', IndexRoute);
}
