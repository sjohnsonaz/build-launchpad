import {IListQuery} from './IListQuery';

import {ISortColumn, SortDirection} from './ISortColumn';

export interface ColumnsHash {
    [index: string]: ISortColumn;
}

export interface ISort<T extends IListQuery> {
    columnsHash: ColumnsHash;
    columns: ISortColumn[];
    numColumns: number;
    addColumn(name: string, direction: SortDirection): any;
    removeColumn(name: string): any;
    toQuery(): T;
}

export {ISortColumn, SortDirection};
