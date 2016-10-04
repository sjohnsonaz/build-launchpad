import {IState} from './IState';
import {IStore} from './IStore';
import {IData} from './IData';
import {IModel} from './IModel';
import {IDataSource} from './IDataSource';
import {IFilter} from './IFilter';
import {IListQuery} from './IListQuery';

export enum Operation {
    Get = 0,
    Create,
    Edit,
    Delete
}

export interface IManager<T, U extends IData<T>, V extends IModel<T, U, any>, W extends IStore<T, any, U, V, X>, X extends IListQuery> extends IState {
    item: V;
    idToDelete: T;
    operation: Operation;
    store: W;
    dataSource: IDataSource<any, U, X>;
    defaultItem: X;

    // TODO: Fix this
    //selectedItems: U[];
    slideIndex: number;

    init(id?: T, query?: X, defaultItem?: X): any;
    clear(): any;
    dispose(): any;
    // TODO: Fix this
    //clearSelection(): any;
    clearOperation(): any;
    create(): any;
    edit(id: T, success?: (data: V) => any, error?: (data: Error) => any): any;
    delete(id: T): any;
    cancel(): any;
    confirm(saveAndContinue?: boolean, success?: (data: T | boolean) => any, error?: (data: Error) => any): any;
}
