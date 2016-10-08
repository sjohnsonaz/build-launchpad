import {observable} from 'mobx';
import {validate, ValidationError} from 'class-validator';

import {IData} from '../interfaces/IData';
import {ICrudConnection} from '../interfaces/ICrudConnection';
import {IModel, ModelNumberIndex, ModelStringIndex} from '../interfaces/IModel';
import QueryModel from './QueryModel';

export {ValidationError};

export default class Model<T, U extends IData<T>, V extends ICrudConnection<T, U, any>> extends QueryModel<U> implements IModel<T, U, V> {
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

    validate(result: (errors: ValidationError[]) => any, error?: (reason: any) => any): any {
        validate(this).then(result).catch(error);
    }

    save(success: (n: T | boolean) => any, error: (n: Error, e?: ValidationError[]) => any) {
        this.validate((errors: ValidationError[]) => {
            if (!errors.length) {
                if (this.connection) {
                    this.saving = true;
                    if (this.Id) {
                        this.connection.put(this.unwrap(), (data) => {
                            this.saving = false;
                            if (success) {
                                success(data);
                            }
                        }, (data) => {
                            this.saving = false;
                            if (error) {
                                error(data);
                            }
                        });
                    } else {
                        this.connection.post(this.unwrap(), (data) => {
                            this.Id = data;
                            this.saving = false;
                            if (success) {
                                success(data);
                            }
                        }, (data) => {
                            this.saving = false;
                            if (error) {
                                error(data);
                            }
                        });
                    }
                } else {
                    if (error) {
                        error(new Error('No connection associated with Model.'));
                    }
                }
            } else {
                /*
                var errorIndex = {};
                for (var index = 0, length = errors.length; index < length; index++) {
                    var validationError = errors[index];
                    if (this === validationError.target) {
                        errorIndex[validationError.property] = validationError;
                    }
                }
                */
                if (error) {
                    error(new Error('Model is invalid.'), errors);
                }
            }
        }, () => {
            if (error) {
                error(new Error('Validation system failed.'));
            }
        });
    }

    delete(success: (n: boolean) => any, error: (n: Error) => any) {
        if (this.connection) {
            if (this.Id) {
                this.deleting = true;
                this.connection.delete(this.Id, (data) => {
                    this.deleting = false;
                    if (success) {
                        success(data);
                    }
                }, (data) => {
                    this.deleting = false;
                    if (error) {
                        error(data);
                    }
                });
            } else {
                if (error) {
                    error(new Error('Model does not have an Id.'));
                }
            }
        } else {
            if (error) {
                error(new Error('No connection associated with Model.'));
            }
        }
    }

    buildChildren(...indexes: (ModelNumberIndex<any> | ModelStringIndex<any>)[]) {

    }

    static wrapArray<T extends number, U extends IData<T>, V extends IModel<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: ModelNumberIndex<U>): V[];
    static wrapArray<T extends string, U extends IData<T>, V extends IModel<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: ModelStringIndex<U>): V[];
    static wrapArray<T, U extends IData<T>, V extends IModel<T, U, any>>(values: U[], model: new (data: U) => V, indexObject?: Object): V[] {
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

    static unwrapArray<T, U extends IData<T>, V extends IModel<T, U, any>>(values: V[]) {
        return values.map((value: V, index: number, array: V[]) => {
            return value.unwrap();
        });
    }
}

export {ModelNumberIndex, ModelStringIndex}
