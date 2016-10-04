import {observable, computed} from 'mobx';

import {IListQuery} from '../interfaces/IListQuery';
import {IFilter} from '../interfaces/IFilter';
import {IForeignKeyFilter} from '../interfaces/IForeignKeyFilter';

import Filter from './Filter';

export class FutureForeignKey extends ForeignKey {

}

export class ForeignKey {
    name: string;
    value: number;
}

export interface ForeignKeyHash {
    [index: string]: ForeignKey;
}

export default class ForeignKeyFilter<T extends IListQuery> extends Filter<T> implements IForeignKeyFilter<T> {
    defaultKeys
    @observable keyArray: ForeignKey[] = [];
    keyHash: ForeignKeyHash = {};

    @computed get isComplete(): boolean {
        return true;
    }

    addKey(key: ForeignKey) {
        var hashKey = this.keyHash[key.name];
        if (hashKey) {
            var index = this.keyArray.indexOf(hashKey);
            if (index >= 0) {
                this.keyArray.splice(index, 1);
            }
        }
        this.keyArray.push(key);
        this.keyHash[key.name] = key;
    }

    removeKey(key: ForeignKey | string) {
        if (typeof key === 'string') {
            var hashKey = this.keyHash[key];
        } else {
            var hashKey = this.keyHash[key.name];
        }
        if (hashKey) {
            var index = this.keyArray.indexOf(hashKey);
            if (index >= 0) {
                this.keyArray.splice(index, 1);
            }
        }
    }
}
