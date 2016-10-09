import {observable, computed} from 'mobx';
import {browserHistory} from 'react-router';

import {IConnectionIndex, IStoreIndex, IStateIndex} from '../base/front/interfaces/IGlobalState';
import GlobalState from '../base/front/implementations/GlobalState';

import UserConnection from '../implementations/connections/UserConnection';
import UserStore from '../implementations/stores/UserStore';
import UserManager from '../implementations/managers/UserManager';

export interface IInitialization {
    rootPath: string;
    controllerPath: string;
    applicationPath: string;
    apiPath: string;
    companyId: any;
}

export interface Connections extends IConnectionIndex {
    userConnection: UserConnection;
}

export interface Stores extends IStoreIndex {
    userStore: UserStore,
}

export interface Applications extends IStateIndex {
    userState: UserManager;
}

export default class ApplicationState extends GlobalState<Connections, Stores, Applications> {
    constructor(initialization: IInitialization) {
        super();

        this.connections = {
            userConnection: new UserConnection(initialization.apiPath),
        };

        this.stores = {
            userStore: new UserStore(this.connections.userConnection),
        };

        this.states = {
            userState: new UserManager(this.stores.userStore),
        };
    }
}
