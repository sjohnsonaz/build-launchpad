import {IUser} from '../data/IUser';
import {IUserModel} from '../models/IUserModel';
import {IUserConnection} from '../connections/IUserConnection';
import {IUserQuery} from '../queries/IUserQuery';

import {IStore} from '../../base/front/interfaces/IStore';

export interface IUserStore extends IStore<string, IUserConnection, IUser, IUserModel, IUserQuery> {

}
