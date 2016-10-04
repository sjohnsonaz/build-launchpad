import {IListQuery} from './IListQuery';

export interface IFilter<T extends IListQuery> {
    listQuery: T;
    init(listQuery: T);
    toQuery(): T;
}
