import Gateway from '../base/back/Gateway';
import UserModel, {UserDocument} from '../schemas/UserModel';

function buildUser(user, callback) {
    callback(undefined, user);
}

export default class UserGateway extends Gateway<UserDocument> {
    constructor() {
        super(UserModel);
    }

    create(data, callback) {
        UserModel.findOne({
            username: data.username
        }, { _id: 1 }, function(err, result) {
            if (!err && !result) {
                var user = new UserModel(data);
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

    getByUsername(username, callback) {
        UserModel.findOne({
            username: username
        }, callback);
    }

    getOrCreate(data, callback) {
        UserModel.findOne({
            username: data.username
        }, function(err, user) {
            if (!err) {
                if (user) {
                    callback(err, user);
                } else {
                    var user = new UserModel(data);
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

    usernameExists(username, callback) {
        UserModel.findOne({
            username: username
        }, {
                _id: 1
            }, function(err, result) {
                callback(err, !err && result);
            });
    }

    login(username, password, callback) {
        UserModel.findOne({
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
