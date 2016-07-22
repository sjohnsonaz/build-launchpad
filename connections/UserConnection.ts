import CrudConnection from '../base/front/CrudConnection';
import {IUser} from '../interfaces/IUser';

export default class UserConnection extends CrudConnection<string, IUser> {
    constructor(base: string, route?: string) {
        super(base, route || 'User/');
    }
}
