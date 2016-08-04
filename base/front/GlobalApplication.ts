import Connection from './Connection';
import Store from './Store';
import Application from './Application';

export interface ConnectionIndex {
    [index: string]: Connection;
}

export interface StoreIndex {
    [index: string]: Store<any, any, any>;
}

export interface ApplicationIndex {
    [index: string]: Application<any>
}

export class Initialization {
    rootPath: string;
    controllerPath: string;
    applicationPath: string;
    apiPath: string;
}

export default class GlobalApplication<T extends ConnectionIndex, U extends StoreIndex, V extends ApplicationIndex> {
    initialization: Initialization;
    connections: T;
    stores: U;
    applications: V;
}
