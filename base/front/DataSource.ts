import {observable, computed} from 'mobx';

import Model from './Model';

export enum SortDirection {
    None = 0,
    Asc,
    Desc
}

export interface DataSortParams {
    pageSize?: number;
    page?: number;
    pagerSize?: number;
    sortedColumn?: string;
    sortedDirection?: SortDirection;
    activeRows?: Array<any>;
    rowCount?: number;
    error?: boolean;
}

export class DataResult<T extends Model<any, any, any>> {
    data: T[];
    count: number;
    constructor(data: T[], count: number) {
        this.data = data;
        this.count = count;
    }
}

export interface RefreshCallback<T extends Model<any, any, any>> {
    (
        page: number,
        pageSize: number,
        sortedColumn: string,
        sortedDirection: SortDirection,
        success: SuccessCallback<T>,
        error: ErrorCallback
    ): void;
}

export interface SuccessCallback<T extends Model<any, any, any>> {
    (data: T[], count: number): void;
}

export interface ErrorCallback {
    (): void;
}

export default class DataSource<T extends Model<any, any, any>> {
    @observable pageSize: number;
    @observable page: number;
    @observable pagerSize: number;
    @observable sortedColumn: string;
    @observable sortedDirection: SortDirection = SortDirection.None;
    @observable activeRows: Array<any> = [];
    @observable rowCount: number = 0;
    @observable error: boolean = false;

    refreshData: RefreshCallback<T>;
    lockRefresh: boolean = true;
    runCount: number = 0;

    @computed get dataComputed() {
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = this.sortedColumn;
        var sortedDirection = this.sortedDirection;
        if (!this.lockRefresh) {
            this.run(true);
        }
        return true;
    }

    constructor(refreshData: RefreshCallback<T>, params?: DataSortParams) {
        params = params || {};
        this.pageSize = params.pageSize || 20;
        this.page = params.page || 0;
        this.pagerSize = params.pagerSize || 10;
        this.sortedColumn = params.sortedColumn
        this.sortedDirection = params.sortedDirection
        this.activeRows = params.activeRows
        this.rowCount = params.rowCount || 0;
        this.error = params.error || false;

        this.refreshData = refreshData;
        this.lockRefresh = true;
        this.runCount = 0;
    }

    run(preservePage: boolean = false) {
        this.runCount++;
        var runID = this.runCount;
        this.lockRefresh = false;
        var pageSize = this.pageSize;
        var page = this.page;
        var sortedColumn = sortedColumn;
        var sortedDirection = sortedDirection;
        (() => {
            this.refreshData(page, pageSize, sortedColumn, sortedDirection, (data: Array<T>, count: number) => {
                if (runID == this.runCount) {
                    this.activeRows = data;
                    this.rowCount = count;
                    if (!preservePage) {
                        this.page = 0;
                    }
                    this.error = false;
                }
            }, function() {
                if (runID == this.runCount) {
                    this.error = true;
                }
            });
        })();
    }

    clear() {
        var lockRefresh = this.lockRefresh;
        this.page = 0;
        this.rowCount = 0;
        this.activeRows = [];
        this.lockRefresh = lockRefresh;
    };

    static pageArray<T extends Model<any, any, any>>(results: Array<any>, page: number, pageSize: number, sortedColumn: string, sortedDirection: SortDirection): DataResult<T> {
        if (results && sortedColumn) {
            results.sort(function(a, b) {
                a = (a[sortedColumn] || '').toString();
                b = (b[sortedColumn] || '').toString();

                var ax = [],
                    bx = [];

                a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                    ax.push([$1 || Infinity, $2 || ""])
                });
                b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                    bx.push([$1 || Infinity, $2 || ""])
                });

                while (ax.length && bx.length) {
                    var an = ax.shift();
                    var bn = bx.shift();
                    var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                    if (nn) return nn;
                }

                return ax.length - bx.length;
            });

            if (sortedDirection === undefined || sortedDirection === SortDirection.None) {
                sortedDirection = SortDirection.Asc;
            }

            if (sortedDirection === SortDirection.Desc) {
                results.reverse();
            }
        }

        return results ? new DataResult(results.slice(page * pageSize, (page + 1) * pageSize), results.length) : new DataResult([], 0);
    };
}
