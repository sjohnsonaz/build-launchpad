import Store from '../base/front/Store';
import UserConnection from '../connections/UserConnection';
import User from '../models/User';

export default class CompanySupplierStore extends Store<string, UserConnection, User> {
    constructor(connection: UserConnection, modelConstructor?: new (...args: any[]) => User) {
        super(connection, modelConstructor || User);
    }
}
