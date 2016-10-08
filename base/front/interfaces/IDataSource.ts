import {IData} from './IData';
import {IFilter} from './IFilter';
import {IListQuery} from './IListQuery';
import {ISort} from './ISort';
import {IStore} from './IStore';
import {IPagination} from './IPagination';

export interface IDataSource<T, U extends IData<T>, V extends IListQuery> extends IPagination<U> {
    data: U[];
    sort: ISort<V>;
    store?: IStore<T, any, U, any, V>;
    filter: IFilter<V>;
    cache: boolean;

    init(data?: U[], store?: IStore<T, any, U, any, V>, query?: V, sort?: ISort<V>, success?: (data: U[], count: number) => any, error?: (error: Error) => any);
    clearCache();
    clear();
}

export interface IDataSourceResult<T> {
    data: T[];
    count: number;
}
