declare var window: any;
import * as React from 'react';
import * as ReactDom from 'react-dom';

import Application from './Application';

import ApplicationState, {IInitialization} from './ApplicationState';

import Routing from './Routing';
Routing.run();

import {polyfill} from '../lib/Object.assign';
polyfill();

declare var $initialization: IInitialization;
declare var $global: any;

window.onload = function() {
    console.log('started');
    $global.initialization = $initialization;
    window.$rootPath = $global.initialization.rootPath;
    window.$controllerPath = $global.initialization.controllerPath;
    window.$applicationPath = $global.initialization.applicationPath;
    window.$apiPath = $global.initialization.apiPath;

    var applicationState = new ApplicationState($initialization);
    $global.application = applicationState;

    ReactDom.render((
        <Application path={$global.initialization.controllerPath} application={applicationState}></Application>
    ), document.getElementById('application-root'));
};
