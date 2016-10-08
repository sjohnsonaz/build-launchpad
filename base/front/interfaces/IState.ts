export interface IState {
    title: string | JSX.Element;
    showCommands: boolean;
    init();
    dispose();
}
