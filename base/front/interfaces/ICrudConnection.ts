import {IConnection} from './IConnection';
import {IData} from './IData';
import {IListQuery} from './IListQuery';
import {IListResult} from './IListResult';

export interface ICrudConnection<T, U extends IData<T>, V extends IListQuery> extends IConnection {
    list(query: V, success: (data: IListResult<U>) => any, error: (data: Error) => any): any;
    get(id: T, success: (data: U) => any, error: (data: Error) => any): any;
    post(data: U, success: (data: T) => any, error: (data: Error) => any): any;
    put(data: U, success: (data: boolean) => any, error: (data: Error) => any): any;
    delete(id: T, success: (data: boolean) => any, error: (data: Error) => any): any;
}
