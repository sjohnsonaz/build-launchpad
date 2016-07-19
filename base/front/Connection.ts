import 'whatwg-fetch';
import {IModel} from './IModel';

export interface ListQuery {
    offset?: number;
    limit?: number;
}

class Connection<T, U extends IModel<T>> {
    base: string;

    constructor(base: string, route?: string) {
        this.base = base;
        if (route) {
            this.base += route;
        }
    }

    status(response: Response): Promise<Response | void> {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    json<V>(response: Response): Promise<V> {
        return response.json();
    }


    list(query: ListQuery, success: (data: U[]) => any, error: (data: Error) => any) {
        fetch(this.base + Connection.objectToQueryString(query || {}))
            .then(this.status)
            .then(this.json)
            .then(success)
            .catch(error);
    }

    get(id: T, success: (data: U) => any, error: (data: Error) => any) {
        fetch(this.base + id)
            .then(this.status)
            .then(this.json)
            .then(success)
            .catch(error);
    }

    post(data: Object, success: (data: T) => any, error: (data: Error) => any) {
        fetch(this.base, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(this.status)
            .then(this.json)
            .then(success)
            .catch(error);
    }

    put(data: Object, success: (data: boolean) => any, error: (data: Error) => any) {
        fetch(this.base, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(this.status)
            .then(this.json)
            .then(success)
            .catch(error);
    }

    delete(id: T, success: (data: boolean) => any, error: (data: Error) => any) {
        fetch(this.base + id, {
            method: 'DELETE'
        })
            .then(this.status)
            .then(this.json)
            .then(success)
            .catch(error);
    }

    static objectToQueryString(obj: Object) {
        var output;
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return '?' + values.join('&');
    }
}

export default Connection;
