import {IConnection} from '../interfaces/IConnection';
import {IStore} from '../interfaces/IStore';
import {IState} from '../interfaces/IState';
import {IGlobalState, IConnectionIndex, IStoreIndex, IStateIndex, IInitialization } from '../interfaces/IGlobalState';

export default class GlobalState<T extends IConnectionIndex, U extends IStoreIndex, V extends IStateIndex> implements IGlobalState<T, U, V> {
    initialization: IInitialization;
    connections: T;
    stores: U;
    states: V;
}
