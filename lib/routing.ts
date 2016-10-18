import ServiceHelper from '../helpers/ServiceHelper';

import IndexRoute from '../routes/IndexRoute';
import UserRoute from '../routes/UserRoute';
import AdminRoute from '../routes/AdminRoute';

import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

import UserGateway from '../implementations/gateways/UserGateway';

export default function run(app) {
    const userGateway = new UserGateway();

    app.use('/api/auth', ServiceHelper.isService, new AuthService(userGateway).expressRouter);
    app.use('/api/user', ServiceHelper.isService, new UserService(userGateway).expressRouter);

    app.use('/admin', new AdminRoute().expressRouter);
    app.use('/user', new UserRoute().expressRouter);
    app.use('/', new IndexRoute().expressRouter);
}
