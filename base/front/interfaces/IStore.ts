import {ICrudConnection} from './ICrudConnection';
import {IListQuery} from './IListQuery';
import {IModel} from './IModel';
import {IData} from './IData';

export interface IStore<T, U extends ICrudConnection<T, V, X>, V extends IData<T>, W extends IModel<T, any, U>, X extends IListQuery> {
    connection: U;
    modelConstructor: new (data?: V, connection?: U) => W;
    listLoading: boolean;
    listLoaded: boolean;
    getLoading: boolean;
    getLoaded: boolean;
    deleteLoading: boolean;
    deleteLoaded: boolean;

    list(query?: X, success?: (data: Array<V>, count: number) => any, error?: (n: Error) => any): any;
    get(id: T, success?: (n: W) => any, error?: (n: Error) => any): any;
    create(data?: V): W
    createArray(data?: V[]): W[];
    delete(id: T, success?: (n: boolean) => any, error?: (n: Error) => any);
}
