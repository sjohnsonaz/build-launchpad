import {IConnection} from './IConnection';
import {IStore} from './IStore';
import {IState} from './IState';

export interface IConnectionIndex {
    [index: string]: IConnection;
}

export interface IStoreIndex {
    [index: string]: IStore<any, any, any, any, any>;
}

export interface IStateIndex {
    [index: string]: IState;
}

export interface IInitialization {
    rootPath: string;
    controllerPath: string;
    applicationPath: string;
    apiPath: string;
}

export interface IGlobalState<T extends IConnectionIndex, U extends IStoreIndex, V extends IStateIndex> {
    initialization: IInitialization;
    connections: T;
    stores: U;
    states: V;
}
