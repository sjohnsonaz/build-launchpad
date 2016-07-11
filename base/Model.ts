import {observable} from 'mobx';

import Connection from './Connection';

export default class Model<T, U extends Connection<T, Model<T, U>>> {
    Id: T;

    baseData: Object;
    connection: U;
    @observable saving: boolean;
    @observable deleting: boolean;

    constructor(data?: Object, connection?: U) {
        this.wrap(data || {});
        if (connection) {
            this.connection = connection;
        }
    }

    wrap(data: any) {
        this.baseData = data;
        this.Id = data.Id;
    }

    unwrap(): any {
        return {
            Id: this.Id
        }
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
                this.connection.put(this.unwrap(), function (data) {
                    self.saving = false;
                    if (success) {
                        success(data);
                    }
                }, function (data) {
                    self.saving = false;
                    if (error) {
                        error(data);
                    }
                });
            } else {
                this.connection.post(this.unwrap(), function (data) {
                    self.Id = data;
                    self.saving = false;
                    if (success) {
                        success(data);
                    }
                }, function (data) {
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
                this.connection.delete(this.Id, function (data) {
                    self.deleting = false;
                    if (success) {
                        success(data);
                    }
                }, function (data) {
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

    static wrapArray<T extends Model<any, any>>(values, model: new (data) => T, indexObject?: ModelIndex<T>) {
        var output: T[] = [];
        if (values) {
            for (var index = 0, length = values.length; index < length; index++) {
                var wrappedValue = new model(values[index]);
                if (indexObject) {
                    indexObject[wrappedValue.Id] = wrappedValue;
                }
                output.push(wrappedValue);
            }
        }
        return output;
    }

    static unwrapArray<T extends Model<any, any>>(values: T[]) {
        var output = [];
        if (values) {
            for (var index = 0, length = values.length; index < length; index++) {
                output.push(values[index].unwrap());
            }
        }
        return output;
    }
}

export interface ModelIndex<T extends Model<any, any>> {
    [index: number]: T;
}
