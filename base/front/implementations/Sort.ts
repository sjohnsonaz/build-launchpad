import {observable} from 'mobx';

import {IListQuery} from '../interfaces/IListQuery';
import {ISort, ISortColumn, SortDirection, ColumnsHash} from '../interfaces/ISort';

export default class Sort<T extends IListQuery> implements ISort<T> {
    columnsHash: ColumnsHash = {};
    @observable columns: ISortColumn[] = [];
    numColumns: number = 0;

    addColumn(name: string, direction: SortDirection) {
        var columns = this.columns.slice();
        var column = this.columnsHash[name];
        if (column) {
            var index = columns.indexOf(column);
            if (index >= 0) {
                columns.splice(index, 1);
            }
            delete this.columnsHash[name];
        }
        var newColumn = {
            name: name,
            direction: direction
        };
        columns.unshift(newColumn);
        this.columnsHash[name] = newColumn;
        this.columns = columns;
    }

    removeColumn(name: string) {
        var columns = this.columns;
        var column = this.columnsHash[name];
        if (column) {
            var index = this.columns.indexOf(column);
            if (index >= 0) {
                columns.splice(index, 1);
            }
            delete this.columnsHash[name];
        }
    }

    toQuery(): T {
        var columns = this.columns;
        if (columns[0]) {
            switch (columns[0].direction) {
                case SortDirection.ASC:
                    return {
                        sort: columns[0].name
                    } as any;
                case SortDirection.DESC:
                    return {
                        sort_desc: columns[0].name
                    } as any;
                case SortDirection.NONE:
                    return {} as T;
            }
        } else {
            return {} as T;
        }
    }
}
