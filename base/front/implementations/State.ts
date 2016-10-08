import {IState} from '../interfaces/IState';

/*
export interface IStates {
    [index: string]: IState;
};
*/

export abstract class State implements IState {
    title: string | JSX.Element;
    showCommands: boolean;
    abstract init();
    abstract dispose();
}
