import {IData} from '../interfaces/IData';
import {IModel} from '../interfaces/IModel';
import {IManager} from '../interfaces/IManager';
import {IListQuery} from '../interfaces/IListQuery';

export default class ForeignKeyCollection<T, U extends IData<T>, V extends IModel<T, U, any>, W extends IManager<T, U, V, any, X>, X extends IListQuery> {
    manager: W;
    query: X;
    constructor(manager: W) {
        this.manager = manager;
    }

    load(query: X) {
        this.query = query;
        return new Promise<U[]>((resolve, reject) => {
            this.manager.init(undefined, query, query, (data) => {
                resolve(data);
            }, (data) => {
                reject(data);
            });
        });
    }
}
