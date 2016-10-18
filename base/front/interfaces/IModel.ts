import {ValidationError} from 'class-validator';

import {IData} from './IData';
import {IQueryModel} from './IQueryModel';
import {ISelectable} from './ISelectable';
import {ICrudConnection} from './ICrudConnection';

export interface IModel<T, U extends IData<T>, V extends ICrudConnection<T, U, any>> extends IData<T>, IQueryModel<U>, ISelectable {
    save(success: (n: T | boolean) => any, error: (n: Error, e?: ValidationError[]) => any): any;
    delete(success: (n: boolean) => any, error: (n: Error) => any): any;
}

export interface ModelNumberIndex<T extends IData<number>> {
    [index: number]: T;
}

export interface ModelStringIndex<T extends IData<string>> {
    [index: string]: T;
}

export {ValidationError};
