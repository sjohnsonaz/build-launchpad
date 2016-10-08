import {observable, computed, autorunAsync} from 'mobx';

import {IPagination, IRefreshCallback} from '../interfaces/IPagination';

export default class Pagination<T> implements IPagination<T> {
    @observable pageSize: number = 20;
    @observable page: number = 0;

    @observable activeRows: T[] = [];
    @observable rowCount: number = 0;
    @observable error: boolean = false;
    @observable loaded: boolean = false;

    refreshData: IRefreshCallback<T>;
    lockRefresh: boolean = true;
    runCount: number = 0;

    private disposer: any;

    dataComputed() {
        var pageSize = this.pageSize;
        var page = this.page;
        if (!this.lockRefresh) {
            this.run(true);
        }
    }

    constructor(refreshData: IRefreshCallback<T>) {
        this.refreshData = refreshData;
        this.disposer = autorunAsync(() => {
            this.dataComputed();
        });
    }

    run(preservePage: boolean = false, success?: (data: T[], count: number) => any, error?: (error: Error) => any) {
        this.runCount++;
        var runID = this.runCount;
        this.lockRefresh = false;
        var pageSize = this.pageSize;
        var page = this.page;
        (() => {
            this.refreshData(page, pageSize, (data: T[], count: number) => {
                if (runID == this.runCount) {
                    this.activeRows = data;
                    this.rowCount = count;
                    if (!preservePage) {
                        this.page = 0;
                    }
                    this.error = false;
                    this.loaded = true;
                }
                if (success) {
                    success(data, count);
                }
            }, (data: Error) => {
                if (runID == this.runCount) {
                    this.error = true;
                    this.loaded = false;
                }
                if (error) {
                    error(data);
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
        this.loaded = false;
    }

    dispose() {
        this.disposer();
    }
}
