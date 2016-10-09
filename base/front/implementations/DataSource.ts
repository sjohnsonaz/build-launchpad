import {observable, computed} from 'mobx';

import {ObjectConstructor} from '../../../lib/Object.assign';

import {IData} from '../interfaces/IData';
import {IListQuery} from '../interfaces/IListQuery';
import {ISort, SortDirection} from '../interfaces/ISort';
import {IFilter} from '../interfaces/IFilter';
import {IStore} from '../interfaces/IStore';
import {IRefreshCallback, ISuccessCallback, IErrorCallback} from '../interfaces/IPagination';
import {IDataSource, IDataSourceResult} from '../interfaces/IDataSource';

import Sort from './Sort';
import Filter from './Filter';
import Pagination from './Pagination';

export default class DataSource<T, U extends IData<T>, V extends IListQuery> extends Pagination<U> implements IDataSource<T, U, V> {
    @observable data: U[];
    store: IStore<T, any, U, any, V>;
    @observable sort: ISort<V> = new Sort<V>();
    @observable filter: IFilter<V>;
    @observable cache: boolean;

    constructor(data?: U[], store?: IStore<T, any, U, any, V>, query?: V | IFilter<V>, sort?: ISort<V>) {
        super((page: number, pageSize: number, success: ISuccessCallback<U>, error: IErrorCallback) => {
            if (this.store) {
                // Use Store
                if (!this.cache) {
                    // No Cache
                    this.store.list(DataSource.buildQuery(page, pageSize, this.sort, this.filter), (data, count) => {
                        success(data, count);
                    }, (data) => {
                        error(data);
                    });
                } else {
                    // Use Cache and Store
                    if (this.data) {
                        var result = DataSource.pageArray(this.data, page, pageSize, this.sort)
                        success(result.data, result.count);
                    } else {
                        this.store.list(DataSource.buildQuery(0, undefined, this.sort, this.filter), (data, count) => {
                            this.data = data;
                            var result = DataSource.pageArray(this.data, page, pageSize, this.sort)
                            success(result.data, result.count);
                        }, (data) => {
                            error(data);
                        });
                    }
                }
            } else {
                // Use Cache
                var result = DataSource.pageArray(this.data, page, pageSize, this.sort)
                success(result.data, result.count);
            }
        });
        this.lockRefresh = true;
        this.data = data;
        this.store = store;
        if (query) {
            if ((<IFilter<V>>query).listQuery !== undefined) {
                this.filter = query as IFilter<V>;
            } else {
                this.filter = new Filter<V>();
                this.filter.init(query as V);
            }
        } else {
            this.filter = new Filter<V>();
        }
        //this.sort = sort || new Sort();
        this.cache = !!data;
        this.lockRefresh = false;
    }

    init(data?: U[], store?: IStore<T, any, U, any, V>, query?: V, sort?: ISort<V>, success?: (data: U[], count: number) => any, error?: (error: Error) => any) {
        this.lockRefresh = true;
        this.data = data;
        this.store = store;
        this.filter.init(query);
        //this.sort = sort || new Sort();
        this.cache = !!data;
        this.lockRefresh = false;
        this.run(false, success, error);
    }

    clearCache() {
        this.data = undefined;
    }

    clear() {
        this.runCount++;
        this.lockRefresh = true;
        this.clearCache();
        this.activeRows = [];
        this.rowCount = 0;
        this.page = 0;
        this.error = false;
        this.lockRefresh = false;
    }

    dataComputed() {
        var pageSize = this.pageSize;
        var page = this.page;
        if (this.sort && this.sort.columns) {
            var sortColumns = this.sort.columns;
            for (var index = 0, length = sortColumns.length; index < length; index++) {
                var name = sortColumns[index].name;
                var direction = sortColumns[index].direction;
            }
        }
        var cache = this.cache;
        if (!this.lockRefresh) {
            this.run(true);
        }
        return true;
    }

    static buildQuery<T>(page: number, pageSize: number, sort: ISort<T>, filter: IFilter<T>) {
        return Object.assign({
            offset: page * pageSize,
            limit: pageSize
        }, sort.toQuery(), filter.toQuery());
    }

    static filterArray<T>(results: T[], filter: IFilter<any>) {
        return results;
    }

    static pageArray<T>(results: T[], page: number, pageSize: number, sort: ISort<any>): IDataSourceResult<T> {
        if (results) {
            var columns = sort.columns;
            for (var index = columns.length - 1; index >= 0; index--) {
                var column = columns[index];
                var name = column.name;
                var direction = column.direction;
                if (name) {
                    results.sort(function(a, b) {
                        var aProperty = (a[name] || '').toString();
                        var bProperty = (b[name] || '').toString();

                        var ax = [],
                            bx = [];

                        aProperty.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                            ax.push([$1 || Infinity, $2 || ""]);
                        });
                        bProperty.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                            bx.push([$1 || Infinity, $2 || ""]);
                        });

                        while (ax.length && bx.length) {
                            var an = ax.shift();
                            var bn = bx.shift();
                            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                            if (nn) return nn;
                        }

                        return ax.length - bx.length;
                    });
                }

                if (direction === SortDirection.DESC) {
                    results.reverse();
                }
            }
        }

        return results ? {
            data: results.slice(page * pageSize, (page + 1) * pageSize),
            count: results.length
        } : {
                data: [],
                count: 0
            };
    };
}
