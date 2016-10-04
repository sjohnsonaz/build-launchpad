import {IListQuery} from '../interfaces/IListQuery';
import {IFilter} from '../interfaces/IFilter';

export default class Filter<T extends IListQuery> implements IFilter<T> {
    listQuery: T;
    constructor(listQuery?: T) {
        this.init(listQuery || ({} as T));
    }

    init(listQuery: T) {
        this.listQuery = listQuery || ({} as T);
    }

    toQuery() {
        return this.listQuery;
    }
}
