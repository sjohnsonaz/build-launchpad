import {observable} from 'mobx';
import Connection from './Connection';
import Store from './Store';

export interface Stores {
    [index: string]: Store<any, any, any>;
}

export interface Applications {
    [index: string]: Application<any>;
};

export default class Application<T extends Stores> {
    @observable subApplications: Applications;
    @observable activeSubApplication: Application<any>;
    @observable stores: T;
    title: string;

    constructor(stores: T) {
        this.stores = stores;
    }
}
