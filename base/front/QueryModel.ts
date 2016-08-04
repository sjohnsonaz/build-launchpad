import {observable} from 'mobx';

export default class QueryModel<T> {
    baseData: T;

    constructor(data?: T) {
        this.wrap(data || ({} as T));
    }

    wrap(data: T) {
        this.baseData = data;
    }

    unwrap(): T {
        return {
        } as T;
    }

    revert() {
        this.wrap(this.baseData);
    }

    update() {
        this.baseData = this.unwrap();
    }
}
