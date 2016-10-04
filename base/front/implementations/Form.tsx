import * as React from 'react';
import {observer} from 'mobx-react';

import {IModel} from '../interfaces/IModel';

export interface IFormProps<T extends IModel<any, any, any>> {
    model: T;
}

@observer
export default class Form<T extends IModel<any, any, any>> extends React.Component<IFormProps<T>, any> {
    constructor(props) {
        super(props);
    }

    updateProperty = (key: string, value) => {
        this.props.model[key] = value
    }

    onChange = (value: string, event: React.FormEvent) => { //
        var target = event.target as HTMLInputElement;
        this.updateProperty(target.name, value)
    }

    render() {
        return (
            <form></form>
        );
    }
}