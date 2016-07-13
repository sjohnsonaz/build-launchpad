import {observable} from 'mobx';
import Connection, {ListQuery} from './Connection';
import Model from './Model';

export default class Store<T, U extends Connection<T, V>, V extends Model<T, U>> {
    connection: U;
    modelConstructor: new (data?: Object, connection?: U) => V;
    @observable listLoading: boolean = false;
    @observable listLoaded: boolean = false;
    @observable getLoading: boolean = false;
    @observable getLoaded: boolean = false;

    constructor(connection: U, modelConstructor?: new (data?: Object, connection?: U) => V) {
        this.connection = connection;
        this.modelConstructor = modelConstructor;
    }

    list(query?: ListQuery, success?: (n: Array<V>) => any, error?: (n: Error) => any) {
        var self = this;
        this.listLoading = true;
        this.listLoaded = false;
        this.connection.list(query, function (data) {
            self.listLoading = false;
            self.listLoaded = true;
            if (success) {
                success(Store.objectDictionaryToModelArray(data, self.modelConstructor, self.connection));
            }
        }, function (data) {
            self.listLoading = false;
            self.listLoaded = false;
            if (error) {
                error(data);
            }
        });
    }

    get(id: T, success?: (n: V) => any, error?: (n: Error) => any) {
        var self = this;
        this.getLoading = true;
        this.getLoaded = false;
        this.connection.get(id, function (data) {
            self.getLoading = false;
            self.getLoaded = true;
            if (success) {
                success(Store.objectToModel(data, self.modelConstructor, self.connection));
            }
        }, function (data) {
            self.getLoading = false;
            self.getLoaded = false;
            if (error) {
                error(data);
            }
        });
    }

    create(data?: any) {
        return new this.modelConstructor(data, this.connection);
    }

    static objectArrayToModelArray<T extends Model<any, U>, U extends Connection<any, T>>(data: Array<Object>, model: new (data?: Object, connection?: U) => T, connection?: U): Array<T> {
        var results: Array<T> = [];
        if (data) {
            for (var index = 0, length = data.length; index < length; index++) {
                var item = data[index];
                results.push(new model(item, connection));
            }
        }
        return results;
    }

    static objectDictionaryToModelArray<T extends Model<any, U>, U extends Connection<any, T>>(data: Object, model: new (data?: Object, connection?: U) => T, connection?: U): Array<T> {
        var results: Array<T> = [];
        if (data) {
            for (var index in data) {
                if (data.hasOwnProperty(index)) {
                    var item = data[index];
                    results.push(new model(item, connection));
                }
            }
        }
        return results;
    }

    static objectToModel<T extends Model<any, any>, U extends Connection<any, T>>(data: Object, model: new (data?: Object, connection?: U) => T, connection?: U): T {
        if (data) {
            return new model(data, connection);
        } else {
            throw new Error('No data received.');
        }
    }
}
