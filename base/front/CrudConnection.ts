import {IModel} from './IModel';
import {IListQuery} from './IListQuery';
import Connection from './Connection';

export default class CrudConnection<T, U extends IModel<T>> extends Connection {
    list(query: IListQuery, success: (data: U[]) => any, error: (data: Error) => any) {
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
