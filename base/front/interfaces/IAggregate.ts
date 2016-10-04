import {IManager} from './IManager';
import {IState} from './IState';

export interface IAggregate<T> extends IState {
    init(id?: T);
    clear();
}
