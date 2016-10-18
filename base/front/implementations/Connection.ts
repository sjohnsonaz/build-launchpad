import 'whatwg-fetch';
import {IConnection} from '../interfaces/IConnection';

export default class Connection implements IConnection {
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

    call<T>(url: string | Request, init: RequestInit, success: (data: T) => any, error: (data: Error) => any) {
        init = init || {};
        // Change credentials default to 'include'.
        init.credentials = init.credentials || 'include';
        fetch(url, init)
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
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return '?' + values.join('&');
    }
}
