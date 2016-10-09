// TODO: Fix this.
declare var $global: any;

import {observable, computed} from 'mobx';

import {IUser, Role} from '../../interfaces/data/IUser';
import {IUserModel} from '../../interfaces/models/IUserModel';
import {IUserConnection} from '../../interfaces/connections/IUserConnection';

import Model from '../../base/front/implementations/Model';

export default class UserModel extends Model<string, IUser, IUserConnection> implements IUserModel {
    @observable username: string;
    name: UserFullName = new UserFullName();
    @observable password: string;
    @observable passwordVersion: number;
    @observable salt: string;
    @observable algorithm: string;
    @observable role: Role;
    @observable created: Date;
    @observable modified: Date;

    wrap(data: IUser) {
        super.wrap(data);
        this.username = data.username;
        this.name.first = data.name.first;
        this.name.last = data.name.last;
        this.password = data.password;
        this.passwordVersion = data.passwordVersion;
        this.salt = data.salt;
        this.algorithm = data.algorithm;
        this.role = data.role;
        this.created = data.created;
        this.modified = data.modified;
    }

    unwrap(): IUser {
        var output = super.unwrap();
        output.username = this.username;
        output.name = {
            first: this.name.first,
            last: this.name.last
        };
        output.password = this.password;
        output.passwordVersion = this.passwordVersion;
        output.salt = this.salt;
        output.algorithm = this.algorithm;
        output.role = this.role;
        output.created = this.created;
        output.modified = this.modified;
        return output;
    }
}

export class UserFullName {
    @observable first: string;
    @observable last: string;
}
