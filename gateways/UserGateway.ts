import User, {UserDocument} from '../schemas/User';

function buildUser(user, callback) {
    callback(undefined, user);
}
export default class UserGateway {
    static create(data, callback) {
        User.findOne({
            username: data.username
        }, { _id: 1 }, function(err, result) {
            if (!err && !result) {
                var user = new User(data);
                user.save(function(err, user) {
                    if (err) {
                        callback(err, user);
                    } else {
                        buildUser(user, callback);
                    }
                });
            } else {
                callback(err, false);
            }
        });
    }
    static get(id, callback) {
        User.findOne({
            _id: id
        }, callback);
    }
    static getByUsername(username, callback) {
        User.findOne({
            username: username
        }, callback);
    }
    static list(params, callback) {
        params = params || {};
        var find = params.find || {};
        var select = params.select;
        var page = parseInt(params.page || 0);
        var pageSize: number | string = parseInt(params.pageSize || 20);
        var sort = params.sort;

        User.find(find).count(function(err, count) {
            if (!err) {
                var query = User.find(find);
                if (select) {
                    query = query.select(select);
                }
                if (pageSize !== 'all') {
                    query = query.skip(page * (pageSize as number)).limit(pageSize as number);
                }
                if (sort) {
                    query.sort(sort);
                }
                query.exec(function(err, result) {
                    if (!err) {
                        callback(err, {
                            count: count,
                            results: result
                        });
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    }
    static update(id, data, callback) {
        User.update({
            _id: id
        }, data, {
                runValidators: true
            }, callback);
    }
    static delete(id, callback) {
        User.remove({
            _id: id
        }, callback);
    }
    static getOrCreate(data, callback) {
        User.findOne({
            username: data.username
        }, function(err, user) {
            if (!err) {
                if (user) {
                    callback(err, user);
                } else {
                    var user = new User(data);
                    user.save(function(err, user) {
                        if (err) {
                            callback(err);
                        } else {
                            buildUser(user, callback);
                        }
                    });
                }
            } else {
                callback(err);
            }
        });
    }
    static usernameExists(username, callback) {
        User.findOne({
            username: username
        }, {
                _id: 1
            }, function(err, result) {
                callback(err, !err && result);
            });
    }
    static login(username, password, callback) {
        User.findOne({
            username: username
        }).select('+password +salt +algorithm').exec(function(err, user) {
            if (!err && user) {
                if (user.validPassword(password)) {
                    user.password = undefined;
                    user.salt = undefined;
                    user.algorithm = undefined;
                    callback(err, user);
                } else {
                    callback(err, false);
                }
            } else {
                callback(err, false);
            }
        });
    }
}
