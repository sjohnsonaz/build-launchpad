import Connection from '../base/front/Connection';
import {IUser} from '../interfaces/IUser';

export default class UserConnection extends Connection<string, IUser> {
    constructor(base: string, route?: string) {
        super(base, route || 'User/');
    }
}
