import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
//var ObjectId = mongoose.Schema.Types.ObjectId;

import config from '../config';

import {IUser} from '../models/IUser';

//import {testPassword} from '../lib/Validation';

export const UserSchema: mongoose.Schema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    name: {
        first: {
            type: String,
            trim: true,
            required: true
        },
        last: {
            type: String,
            trim: true,
            required: true
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    passwordVersion: {
        type: Number,
        default: 0,
        select: false
    },
    salt: {
        type: String,
        select: false
    },
    algorithm: {
        type: String,
        select: false
    },
    role: {
        type: String,
        enum: ['none', 'admin'],
        default: 'none'
    },
    created: Date,
    modified: Date,
});

UserSchema.index({
    'username': 1,
    'name.first': 1,
    'name.last': 1
});

function createSalt() {
    return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt, algorithm) {
    var hash = crypto.createHash(algorithm);
    hash.update(salt + password);
    return hash.digest('hex');
}

UserSchema.methods.validPassword = function(password) {
    return this.password === hashPassword(password, this.salt, this.algorithm);
};

UserSchema.pre('save', function(next) {
    this.created = this._id.getTimestamp();
    this.modified = this.created;
    this.salt = createSalt();
    this.algorithm = config.hashAlgorithm;
    this.password = hashPassword(this.password, this.salt, this.algorithm);
    next();
});

UserSchema.pre('update', function(next) {
    var $set: any = {
        modified: new Date()
    };
    var password = this.getUpdate().$set.password;
    if (password) {
        $set.salt = createSalt();
        $set.algorithm = config.hashAlgorithm;
        $set.password = hashPassword(password, $set.salt, $set.algorithm);
    }
    this.update({}, {
        $set: $set
    });
    next();
});

export interface UserDocument extends mongoose.Document, IUser {
    validPassword: (password: string) => boolean;
}

export default mongoose.model<UserDocument>('User', UserSchema);
