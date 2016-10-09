import {IUser} from '../data/IUser';
import {IUserConnection} from '../connections/IUserConnection';

import {IModel} from '../../base/front/interfaces/IModel';

export interface IUserModel extends IModel<string, IUser, IUserConnection> {

}
