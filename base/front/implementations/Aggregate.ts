import {IManager} from '../interfaces/IManager';
import {IAggregate} from '../interfaces/IAggregate';
import {State} from './State';

export abstract class Aggregate<T> extends State implements IAggregate<T> {
    abstract init(id?: T);
    abstract clear();
}
