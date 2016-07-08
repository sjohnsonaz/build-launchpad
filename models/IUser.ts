export enum Role {
    none,
    admin
}

export interface IUser {
    username: string
    name: {
        first: string,
        last: string
    },
    password: string,
    passwordVersion: number
    salt: string,
    algorithm: string,
    role: Role,
    created: Date,
    modified: Date,
}
