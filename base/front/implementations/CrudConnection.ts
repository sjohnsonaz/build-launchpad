import {IData} from '../interfaces/IData';
import {IListQuery} from '../interfaces/IListQuery';
import {IListResult} from '../interfaces/IListResult';
import {ICrudConnection} from '../interfaces/ICrudConnection';
import Connection from './Connection';

export default class CrudConnection<T, U extends IData<T>, V extends IListQuery> extends Connection implements ICrudConnection<T, U, V> {
    list(query: V, success: (data: IListResult<U>) => any, error: (data: Error) => any) {
        this.call(this.base + Connection.objectToQueryString(query || {}), {}, success, error);
    }

    get(id: T, success: (data: U) => any, error: (data: Error) => any) {
        this.call(this.base + id, {}, success, error);
    }

    post(data: U, success: (data: T) => any, error: (data: Error) => any) {
        this.call(this.base, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, success, error);
    }

    put(data: U, success: (data: boolean) => any, error: (data: Error) => any) {
        this.call(this.base, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }, success, error);
    }

    delete(id: T, success: (data: boolean) => any, error: (data: Error) => any) {
        this.call(this.base + id, {
            method: 'DELETE'
        }, success, error);
    }
}
