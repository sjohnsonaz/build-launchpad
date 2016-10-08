export interface IRefreshCallback<T> {
    (
        page: number,
        pageSize: number,
        success: ISuccessCallback<T>,
        error: IErrorCallback
    ): void;
}

export interface ISuccessCallback<T> {
    (data: T[], count: number): void;
}

export interface IErrorCallback {
    (error: Error): void;
}

export interface IPagination<T> {
    pageSize: number;
    page: number;

    activeRows: T[];
    rowCount: number;
    error: boolean;
    loaded: boolean;

    refreshData: IRefreshCallback<T>;
    lockRefresh: boolean;
    runCount: number;

    dataComputed(): any;
    run(preservePage?: boolean, success?: (data: T[], count: number) => any, error?: (error: Error) => any): any;
    clear(): any;
    dispose(): any;
}
