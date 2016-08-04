import {observable, computed} from 'mobx';

import Application, {Stores} from './Application';
import Store from './Store';
import Model from './Model';
import DataSource from './DataSource';

export interface CrudStores<T extends Store<any, any, any>> extends Stores {
    main: T
}

export enum Operation {
    Get = 0,
    Create,
    Edit,
    Delete
}

export default class CrudApplication<T extends CrudStores<U>, U extends Store<any, any, V>, V extends Model<any, any, any>> extends Application<T> {
    @observable items: V[] = [];
    @observable item: V;
    @observable operation: Operation = Operation.Get;
    dataSource: DataSource<V>;

    @computed get selectedItems() {
        var activeRows = this.dataSource.activeRows;
        var selected: V[] = [];
        for (var index = 0, length = activeRows.length; index < length; index++) {
            var item = activeRows[index];
            if (item.selected) {
                selected.push(item);
            }
        }
        return selected;
    }

    private _slideIndex: number = Operation.Get;
    @computed get slideIndex() {
        if (this.operation !== Operation.Delete) {
            this._slideIndex = this.operation;
        }
        return this._slideIndex;
    }

    constructor(stores: T, dataSource?: DataSource<V>) {
        super(stores);
        this.dataSource = dataSource || new DataSource<V>((page, pageSize, sortedColumn, sortedDirection, success, error) => {
            this.stores.main.list({}, (data, count) => {
                success(data, count);
            }, (data) => {
                error();
            });
        });
        this.dataSource.run();
    }

    refreshList(preservePage: boolean = false) {
        this.dataSource.run(preservePage);
    }

    clearSelection() {
        var selectedItems = this.selectedItems;
        for (var index = 0, length = selectedItems.length; index < length; index++) {
            var item = selectedItems[index];
            item.selected = false;
        }
    }

    clearOperation() {
        if (this.operation !== Operation.Get || this.item) {
            this.cancel();
        }
    }

    create() {
        this.clearOperation();
        this.operation = Operation.Create;
        this.item = this.stores.main.create();
    }

    edit(item: V) {
        this.clearOperation();
        this.stores.main.get(item.Id, (item) => {
            this.operation = Operation.Edit;
            this.item = item;
        }, (error) => {
        });
    }

    delete(item: V) {
        // We can delete from Get or Edit, so we do not clear operation here.
        this.operation = Operation.Delete;
        this.item = item;
    }

    cancel() {
        switch (this.operation) {
            case Operation.Create:
                // TODO: Remove revert?
                //this.item.revert();
                this.item = undefined;
                this.operation = Operation.Get;
                break;
            case Operation.Edit:
                // TODO: Remove revert?
                //this.item.revert();
                this.operation = Operation.Get;
                this.item = undefined;
                break;
            case Operation.Delete:
                if (this.slideIndex === 0) {
                    this.item = undefined;
                }
                this.operation = this.slideIndex;
                break;
            default:
                break;
        }
    }

    confirm() {
        switch (this.operation) {
            case Operation.Create:
                this.item.save((data) => {
                    this.item = undefined;
                    this.operation = Operation.Get;
                    this.refreshList();
                }, function(error) {
                });
                break;
            case Operation.Edit:
                this.item.save((data) => {
                    this.item = undefined;
                    this.operation = Operation.Get;
                    this.refreshList();
                }, function(error) {
                });
                break;
            case Operation.Delete:
                this.item.delete((data) => {
                    this.item = undefined;
                    this.operation = Operation.Get;
                    this.refreshList();
                }, function(error) {
                });
                break;
        }
    }

    // search
    @observable filteredItems = [];

    filterItems(key: string, term: string) {
        this.filteredItems = this.items.filter((item) => {
            return item[key].toLowerCase().includes(term.toLowerCase())
        });
    }
}
