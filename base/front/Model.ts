import {observable} from 'mobx';

import {IModel} from './IModel';
import Connection from './Connection';

export default class Model<T, U extends IModel<T>, V extends Connection<T, U>> implements IModel<T> {
    Id: T;

    baseData: U;
    connection: V;
    @observable saving: boolean;
    @observable deleting: boolean;

    constructor(data?: U, connection?: V) {
        this.wrap(data || ({} as U));
        if (connection) {
            this.connection = connection;
        }
    }

    wrap(data: U) {
        this.baseData = data;
        this.Id = data.Id;
    }

    unwrap(): U {
        return {
            Id: this.Id
        } as U;
    }

    revert() {
        this.wrap(this.baseData);
    }

    update() {
        this.baseData = this.unwrap();
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

    static wrapArray<T extends number, U extends IModel<T>>(values, model: new (data) => U, indexObject?: ModelNumberIndex<U>);
    static wrapArray<T extends string, U extends IModel<T>>(values, model: new (data) => U, indexObject?: ModelStringIndex<U>);
    static wrapArray<T, U extends IModel<T>>(values, model: new (data) => U, indexObject?: Object) {
        var output: U[] = [];
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

    static unwrapArray<T extends Model<any, any, any>>(values: T[]) {
        var output = [];
        if (values) {
            for (var index = 0, length = values.length; index < length; index++) {
                output.push(values[index].unwrap());
            }
        }
        return output;
    }
}

export interface ModelNumberIndex<T extends IModel<number>> {
    [index: number]: T;
}

export interface ModelStringIndex<T extends IModel<string>> {
    [index: string]: T;
}
