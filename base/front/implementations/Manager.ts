import {observable, computed} from 'mobx';

import {IStore} from '../interfaces/IStore';
import {IData} from '../interfaces/IData';
import {IModel} from '../interfaces/IModel';
import {IDataSource} from '../interfaces/IDataSource';
import {IFilter} from '../interfaces/IFilter';
import {IListQuery} from '../interfaces/IListQuery';
import {IManager, Operation} from '../interfaces/IManager';

import DataSource from './DataSource';
import {State} from './State';

export default class Manager<T, U extends IData<T>, V extends IModel<T, U, any>, W extends IStore<T, any, U, V, X>, X extends IListQuery> extends State implements IManager<T, U, V, W, X> {
    //U extends IStore<any, any, any, V, W>, V extends IModel<any, any, any>, W extends IListQuery> extends State implements IManager<U, V, W> {
    store: W;
    filter: IFilter<X>;
    @observable item: V;
    @observable idToDelete: T;
    @observable operation: Operation = Operation.Get;
    dataSource: IDataSource<T, U, X>;
    defaultItem: X;

    // TODO: Fix this.
    /*
    @computed get selectedItems() {
        var activeRows = this.dataSource.activeRows;
        var selected: U[] = [];
        for (var index = 0, length = activeRows.length; index < length; index++) {
            var item = activeRows[index];
            if (item.selected) {
                selected.push(item);
            }
        }
        return selected;
    }
    */

    private _slideIndex: number = Operation.Get;
    @computed get slideIndex() {
        if (this.operation !== Operation.Delete) {
            this._slideIndex = this.operation;
        }
        return this._slideIndex;
    }

    constructor(store: W, filter?: IFilter<X>) {
        super();
        this.store = store;
        this.filter = filter;
        this.dataSource = new DataSource<T, U, X>(undefined, this.store, this.filter);
    }

    init(id?: T, query?: X, defaultItem?: X, success?: (data: U[], count: number) => any, error?: (error: Error) => any) {
        this.defaultItem = defaultItem;
        this.dataSource.init(undefined, this.store, query, undefined, success, error);
        if (id) {
            this.edit(id);
        }
    }

    clear() {
        this.cancel();
        //this.dataSource.init(undefined, this.store, undefined);
        this.dataSource.clear();
    }

    dispose() {
        this.dataSource.dispose();
    }

    // TODO: Fix this
    /*
    clearSelection() {
        var selectedItems = this.selectedItems;
        for (var index = 0, length = selectedItems.length; index < length; index++) {
            var item = selectedItems[index];
            item.selected = false;
        }
    }
    */

    clearOperation() {
        if (this.operation !== Operation.Get || this.item) {
            this.cancel();
        }
    }

    create() {
        this.clearOperation();
        this.operation = Operation.Create;
        // TODO: Clean this any.
        this.item = this.store.create(this.defaultItem as any);
    }

    edit(id: T, success?: (data: V) => any, error?: (data: Error) => any) {
        this.clearOperation();
        this.store.get(id, (item) => {
            this.operation = Operation.Edit;
            this.item = item;
            if (success) {
                success(item);
            }
        }, (data) => {
            if (error) {
                error(data);
            }
        });
    }

    delete(id: T) {
        // We can delete from Get or Edit, so we do not clear operation here.
        this.operation = Operation.Delete;
        this.idToDelete = id;
    }

    cancel() {
        switch (this.operation) {
            case Operation.Create:
                // TODO: Remove revert?
                //this.item.revert();
                this.operation = Operation.Get;
                this.item = undefined;
                break;
            case Operation.Edit:
                // TODO: Remove revert?
                //this.item.revert();
                this.operation = Operation.Get;
                this.item = undefined;
                break;
            case Operation.Delete:
                if (this.slideIndex === 0) {
                    this.idToDelete = undefined;
                }
                this.operation = this.slideIndex;
                break;
            default:
                break;
        }
    }

    confirm(saveAndContinue: boolean = false, success?: (data: T | boolean) => any, error?: (data: Error) => any) {
        (() => {
            switch (this.operation) {
                case Operation.Create:
                    this.item.save((data) => {
                        if (!saveAndContinue) {
                            this.operation = Operation.Get;
                            this.item = undefined;
                        }
                        this.dataSource.run();
                        if (success) {
                            success(data);
                        }
                    }, function(data) {
                        if (error) {
                            error(data);
                        }
                    });
                    break;
                case Operation.Edit:
                    this.item.save((data) => {
                        if (!saveAndContinue) {
                            this.operation = Operation.Get;
                            this.item = undefined;
                        }
                        this.dataSource.run();
                        if (success) {
                            success(data);
                        }
                    }, function(data) {
                        if (error) {
                            error(data);
                        }
                    });
                    break;
                case Operation.Delete:
                    this.store.delete(this.idToDelete, (data) => {
                        this.operation = Operation.Get;
                        this.item = undefined;
                        this.idToDelete = undefined;
                        this.dataSource.run();
                        if (success) {
                            success(data);
                        }
                    }, function(data) {
                        if (error) {
                            error(data);
                        }
                    });
                    break;
            }
        })();
    }
}
