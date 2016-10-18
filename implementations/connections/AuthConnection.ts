import {IUser} from '../../interfaces/data/IUser';
import {ILogin} from '../../interfaces/data/ILogin';
import {IImpersonate} from '../../interfaces/data/IImpersonate';
import {IIsLoggedIn} from '../../interfaces/data/IIsLoggedIn';

import {IAuthConnection} from '../../interfaces/connections/IAuthConnection';
import Connection from '../../base/front/implementations/Connection';

export default class AuthConnection extends Connection implements IAuthConnection {
    constructor(base: string, route?: string) {
        super(base, route || 'auth/');
    }

    get(success: (data: IIsLoggedIn) => any, error: (data: Error) => any): any {
        this.call(this.base, {}, success, error);
    }

    login(data: ILogin, success: (data: IUser) => any, error: (data: Error) => any): any {
        this.call(this.base + 'login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, success, error);
    }

    logout(success: (data: boolean) => any, error: (data: Error) => any): any {
        this.call(this.base + 'logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, success, error);
    }

    impersonate(data: IImpersonate, success: (data: IUser) => any, error: (data: Error) => any): any {
        this.call(this.base + 'impersonate', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, success, error);
    }

    unimpersonate(success: (data: boolean) => any, error: (data: Error) => any): any {
        this.call(this.base + 'unimpersonate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, success, error);
    }
}
