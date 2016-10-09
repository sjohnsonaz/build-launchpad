import {IUser} from '../data/IUser';
import {IUserQuery} from '../queries/IUserQuery';

import {ICrudConnection} from '../../base/front/interfaces/ICrudConnection';

export interface IUserConnection extends ICrudConnection<string, IUser, IUserQuery> {

}
