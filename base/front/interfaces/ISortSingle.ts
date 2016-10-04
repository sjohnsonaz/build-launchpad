import {IListQuery} from './IListQuery';
import {ISort, ISortColumn} from './ISort';

export interface ISortSingle<T extends IListQuery> extends ISort<T> {
    column: ISortColumn;
}
