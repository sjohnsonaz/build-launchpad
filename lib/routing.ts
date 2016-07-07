import IndexRoute from '../routes/IndexRoute';
import UserRoute from '../routes/UserRoute';

export default function run(app) {
    app.use('/user', UserRoute);
    app.use('/', IndexRoute);
}
