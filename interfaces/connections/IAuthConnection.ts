import {IUser} from '../data/IUser';
import {ILogin} from '../data/ILogin';
import {IImpersonate} from '../data/IImpersonate';
import {IIsLoggedIn} from '../data/IIsLoggedIn';

import {IConnection} from '../../base/front/interfaces/IConnection';

export interface IAuthConnection extends IConnection {
    get(success: (data: IIsLoggedIn) => any, error: (data: Error) => any): any;
    login(data: ILogin, success: (data: IUser) => any, error: (data: Error) => any): any;
    logout(success: (data: boolean) => any, error: (data: Error) => any): any;
    impersonate(data: IImpersonate, success: (data: IUser) => any, error: (data: Error) => any): any;
    unimpersonate(success: (data: boolean) => any, error: (data: Error) => any): any;
}
