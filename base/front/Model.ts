import {observable} from 'mobx';

import {IModel} from './IModel';
import {ISelectable} from './ISelectable';
import CrudConnection from './CrudConnection';
import QueryModel from './QueryModel';

export default class Model<T, U extends IModel<T>, V extends CrudConnection<T, U>> extends QueryModel<U> implements IModel<T>, ISelectable {
    Id: T;

    connection: V;
    @observable saving: boolean;
    @observable deleting: boolean;
    @observable selected;

    constructor(data?: U, connection?: V) {
        super(data);
        if (connection) {
            this.connection = connection;
        }
    }

    wrap(data: U) {
        super.wrap(data);
        this.Id = data.Id;
    }

    unwrap(): U {
        var output = super.unwrap();
        output.Id = this.Id;
        return output;
    }

    save(success: (n: T | boolean) => any, error: (n: Error) => any) {
        var self = this;
        if (this.connection) {
            this.saving = true;
            if (this.Id) {
                this.connection.put(this.unwrap(), function(data) {
                    self.saving = false;
                    if (success) {
                        success(data);
                    }
                }, function(data) {
                    self.saving = false;
                    if (error) {
                        error(data);
                    }
                });
            } else {
                this.connection.post(this.unwrap(), function(data) {
                    self.Id = data;
                    self.saving = false;
                    if (success) {
                        success(data);
                    }
                }, function(data) {
                    self.saving = false;
                    if (error) {
                        error(data);
                    }
                });
            }
        } else {
            error(new Error('No connection associated with Model.'));
        }
    }

    delete(success: (n: boolean) => any, error: (n: Error) => any) {
        var self = this;
        if (this.connection) {
            if (this.Id) {
                this.deleting = true;
                this.connection.delete(this.Id, function(data) {
                    self.deleting = false;
                    if (success) {
                        success(data);
                    }
                }, function(data) {
                    self.deleting = false;
                    if (error) {
                        error(data);
                    }
                });
            } else {
            }
        } else {
        }
    }

    static wrapArray<T extends number, U extends IModel<T>, V extends Model<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: ModelNumberIndex<U>): V[];
    static wrapArray<T extends string, U extends IModel<T>, V extends Model<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: ModelStringIndex<U>): V[];
    static wrapArray<T, U extends IModel<T>, V extends Model<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: Object): V[] {
        var output: V[] = [];
        if (values) {
            for (var index = 0, length = values.length; index < length; index++) {
                var wrappedValue = new model(values[index]);
                if (indexObject) {
                    indexObject[wrappedValue.Id as any] = wrappedValue;
                }
                output.push(wrappedValue);
            }
        }
        return output;
    }

    static unwrapArray<T, U extends IModel<T>, V extends Model<T, U, any>>(values: V[]) {
        return values.map(function(value: V, index: number, array: V[]) {
            return value.unwrap();
        });
    }
}

export interface ModelNumberIndex<T extends IModel<number>> {
    [index: number]: T;
}

export interface ModelStringIndex<T extends IModel<string>> {
    [index: string]: T;
}
