import * as React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import ApplicationState from '../states/ApplicationState';

export interface ApplicationProps {
    application: ApplicationState;
    path: string;
}

function wrapComponent<T>(Component: React.ComponentClass<T>, props: T) {
    return React.createClass<T, any>({
        render: function () {
            var completeProps: any = props || {};
            completeProps.location = this.props.location;
            completeProps.children = this.props.children;
            return React.createElement<T>(Component, completeProps);
        }
    });
}

export interface WrapperProps {
    application: ApplicationState;
}

export class Wrapper extends React.Component<any, any> {
    render() {
        return (
            <div>Test</div>
        );
    }
}

export default class Application extends React.Component<ApplicationProps, any> {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path={this.props.path} component={wrapComponent(Wrapper, {
                    application: this.props.application
                }) } />
            </Router>
        );
    }
}
