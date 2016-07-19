import {IModel} from '../base/front/IModel';

export enum Role {
    none,
    admin
}

export interface IUser extends IModel<string> {
    username: string;
    name: {
        first: string;
        last: string;
    };
    password: string;
    passwordVersion: number;
    salt: string;
    algorithm: string;
    role: Role;
    created: Date;
    modified: Date;
}
