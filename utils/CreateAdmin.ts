import * as mongoose from 'mongoose';

import User from '../implementations/schemas/UserModel';
import config from '../config';

export default class CreateAdmin {
    static connect() {
        mongoose.connect(config.mongodb.uri, config.mongodb.options, function(err) {
            if (err) {
                console.log('ERROR connecting to: ' + config.mongodb.uri + '. ' + err);
            } else {
                console.log('Succeeded connected to: ' + config.mongodb.uri);
            }
        });
    }
    static run() {
        CreateAdmin.connect();
        var user = new User({
            username: 'admin',
            password: 'test',
            name: {
                first: 'Admin',
                last: 'Admin'
            },
            role: 'admin'
        });
        user.save(function(err, user) {
            if (err) {
                console.error(err);
            } else {
                console.log(user);
            }
            mongoose.disconnect();
        });
    }
}

CreateAdmin.run();
