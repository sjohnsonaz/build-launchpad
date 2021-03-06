﻿import {observable} from 'mobx';
import {ICrudConnection} from '../interfaces/ICrudConnection';
import {IListQuery} from '../interfaces/IListQuery';
import {IModel} from '../interfaces/IModel';
import {IQueryModel} from '../interfaces/IQueryModel';
import {IData} from '../interfaces/IData';
import {IStore} from '../interfaces/IStore';

export default class Store<T, U extends ICrudConnection<T, V, X>, V extends IData<T>, W extends IModel<T, any, U>, X extends IListQuery> implements IStore<T, U, V, W, X> {
    connection: U;
    modelConstructor: new (data?: V, connection?: U) => W;
    @observable listLoading: boolean = false;
    @observable listLoaded: boolean = false;
    @observable getLoading: boolean = false;
    @observable getLoaded: boolean = false;
    @observable deleteLoading: boolean = false;
    @observable deleteLoaded: boolean = false;

    constructor(connection: U, modelConstructor?: new (data?: V, connection?: U) => W) {
        this.connection = connection;
        this.modelConstructor = modelConstructor;
    }

    list(query?: X, success?: (data: Array<V>, count: number) => any, error?: (n: Error) => any) {
        var self = this;
        this.listLoading = true;
        this.listLoaded = false;
        this.connection.list(query, function(data) {
            self.listLoading = false;
            self.listLoaded = true;
            if (success) {
                success(data.DataList, data.TotalCount);
            }
        }, function(data) {
            self.listLoading = false;
            self.listLoaded = false;
            if (error) {
                error(data);
            }
        });
    }

    get(id: T, success?: (n: W) => any, error?: (n: Error) => any) {
        this.getLoading = true;
        this.getLoaded = false;
        this.connection.get(id, (data) => {
            this.getLoading = false;
            this.getLoaded = true;
            if (success) {
                success(Store.objectToModel(data, this.modelConstructor, this.connection));
            }
        }, (data) => {
            this.getLoading = false;
            this.getLoaded = false;
            if (error) {
                error(data);
            }
        });
    }

    create(data?: V) {
        return new this.modelConstructor(data, this.connection);
    }

    createArray(data?: V[]) {
        var output: W[] = [];
        for (var index = 0, length = data.length; index < length; index++) {
            output.push(this.create(data[index]));
        }
        return output;
    }

    // TODO: Add bulk delete
    delete(id: T, success?: (n: boolean) => any, error?: (n: Error) => any) {
        this.connection.delete(id, (data) => {
            this.deleteLoading = false;
            this.deleteLoaded = true;
            if (success) {
                success(data);
            }
        }, (data) => {
            this.deleteLoading = false;
            this.deleteLoaded = false;
            if (error) {
                error(data);
            }
        });
    }

    static objectArrayToQueryModelArray<T, U extends IQueryModel<T>>(data: Array<T>, model: new (data?: T) => U): Array<U> {
        var results: Array<U> = [];
        if (data) {
            for (var index = 0, length = data.length; index < length; index++) {
                var item = data[index];
                results.push(new model(item));
            }
        }
        return results;
    }

    static objectArrayToModelArray<T extends IData<any>, U extends IModel<any, T, V>, V extends ICrudConnection<any, T, any>>(data: Array<T>, model: new (data?: T, connection?: V) => U, connection?: V): Array<U> {
        var results: Array<U> = [];
        if (data) {
            for (var index = 0, length = data.length; index < length; index++) {
                var item = data[index];
                results.push(new model(item, connection));
            }
        }
        return results;
    }

    static objectDictionaryToModelArray<T extends IData<number>, U extends IModel<number, T, V>, V extends ICrudConnection<number, T, any>>(data: IDataNumberDictionary<T>, model: new (data?: Object, connection?: U) => T, connection?: U): Array<T>;
    static objectDictionaryToModelArray<T extends IData<string>, U extends IModel<string, T, V>, V extends ICrudConnection<string, T, any>>(data: IDataStringDictionary<T>, model: new (data?: Object, connection?: U) => T, connection?: U): Array<T> {
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

    static objectDictionaryToObjectArray<T extends IData<number>>(data: IDataNumberDictionary<T>): Array<T>;
    static objectDictionaryToObjectArray<T extends IData<string>>(data: IDataStringDictionary<T>): Array<T> {
        var results: Array<T> = [];
        if (data) {
            for (var index in data) {
                if (data.hasOwnProperty(index)) {
                    results.push(data[index]);
                }
            }
        }
        return results;
    }

    static objectToModel<T extends IData<any>, U extends IModel<any, T, V>, V extends ICrudConnection<any, T, any>>(data: T, model: new (data?: T, connection?: V) => U, connection?: V): U {
        if (data) {
            return new model(data, connection);
        } else {
            throw new Error('No data received.');
        }
    }
}

export interface IDataNumberDictionary<T extends IData<number>> {
    [index: number]: T;
}

export interface IDataStringDictionary<T extends IData<string>> {
    [index: string]: T;
}
