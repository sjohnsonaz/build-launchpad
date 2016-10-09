import {IUser} from '../data/IUser';
import {IUserModel} from '../models/IUserModel';
import {IUserStore} from '../stores/IUserStore';
import {IUserQuery} from '../queries/IUserQuery';

import {IManager} from '../../base/front/interfaces/IManager';

export interface IUserManager extends IManager<string, IUser, IUserModel, IUserStore, IUserQuery> {

}
