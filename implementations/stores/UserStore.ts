import {IUser} from '../../interfaces/data/IUser';
import {IUserModel} from '../../interfaces/models/IUserModel';
import {IUserConnection} from '../../interfaces/connections/IUserConnection';
import {IUserQuery} from '../../interfaces/queries/IUserQuery';

import UserModel from '../models/UserModel';
import Store from '../../base/front/implementations/Store';

export default class UserStore extends Store<string, IUserConnection, IUser, IUserModel, IUserQuery> {
    constructor(connection: IUserConnection, modelConstructor?: new (...args: any[]) => IUserModel) {
        super(connection, modelConstructor || UserModel);
    }
}
