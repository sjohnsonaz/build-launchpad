import {observable} from 'mobx';

import Store from './Store';
import {ListQuery} from './Connection';
import Model from './Model';

import '../external/Object.assign.ts';

interface DataSourceProperties extends ListQuery {
}

export default class DataSource<T extends Model<any, any>, U extends Store<any, any, T>, V extends ListQuery> {
    model: T;
    store: U;
    @observable query: V;
    @observable offset: number;
    @observable limit: number;
    @observable loading: boolean;

    constructor(model: T, store: U, properties?: V) {
        this.store = store;
        this.model = model;
        //Object.assign(this, {
        //    offset: 0,
        //    limit: 50
        //}, properties);
        this.query = properties;
        this.loading = false;
    }

    list(query: V, success?: (n: Array<T>) => any, error?: (n: Error) => any) {
        this.query = query || ({} as any);
        this.offset = this.query.offset || this.offset;
        this.limit = this.query.limit || this.limit;
        this.store.list(query, (data) => {
            this.loading = false;
            success(data);
        }, (data) => {
            this.loading = false;
            error(data);
        });
    }
}
