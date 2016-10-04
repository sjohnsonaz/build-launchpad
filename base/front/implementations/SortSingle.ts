import {ISortColumn} from '../interfaces/ISortColumn';
import {ISortSingle} from '../interfaces/ISortSingle';
import {IListQuery} from '../interfaces/IListQuery';

import Sort from './Sort';

export default class SortSingle<T extends IListQuery> extends Sort<T> implements ISortSingle<T> {
    column: ISortColumn;

    toQuery(): T {
        return {} as T;
    }
}
