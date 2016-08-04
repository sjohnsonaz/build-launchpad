import {observable, computed} from 'mobx';
import {browserHistory} from 'react-router';

import GlobalApplication, {ConnectionIndex, StoreIndex, ApplicationIndex} from '../base/front/GlobalApplication';

import UserConnection from '../connections/UserConnection';
import UserStore from '../stores/UserStore';
import UserState from './UserState';

export interface IInitialization {
    rootPath: string;
    controllerPath: string;
    applicationPath: string;
    apiPath: string;
    companyId: any;
}

export interface Connections extends ConnectionIndex {
    userConnection: UserConnection;
}

export interface Stores extends StoreIndex {
    userStore: UserStore,
}

export interface Applications extends ApplicationIndex {
    userState: UserState;
}

export default class ApplicationState extends GlobalApplication<Connections, Stores, Applications> {
    constructor(initialization: IInitialization) {
        super();

        this.connections = {
            userConnection: new UserConnection(initialization.apiPath),
        };

        this.stores = {
            userStore: new UserStore(this.connections.userConnection),
        };

        this.applications = {
            userState: new UserState({
                main: this.stores.userStore
            }),
        };
    }
}
