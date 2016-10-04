import {IState} from '../interfaces/IState';

/*
export interface IStates {
    [index: string]: IState;
};
*/

export abstract class State implements IState {
    title: string;

    abstract init();
    abstract dispose();
}
