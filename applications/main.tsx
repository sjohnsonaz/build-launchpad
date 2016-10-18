declare var window: any;
import * as React from 'react';
import * as ReactDom from 'react-dom';

import Application from './Application';

import ApplicationState, {IInitialization} from './ApplicationState';

import {polyfill} from '../lib/Object.assign';
polyfill();

declare var $initialization: IInitialization;
declare var $global: any;

$global = $global || {};
$global.initialization = $initialization;
window.$rootPath = $global.initialization.rootPath;
window.$controllerPath = $global.initialization.controllerPath;
window.$applicationPath = $global.initialization.applicationPath;
window.$apiPath = $global.initialization.apiPath;

var applicationState = new ApplicationState($initialization);

window.onload = function() {
    console.log('started');
    ReactDom.render((
        <Application path={$global.initialization.controllerPath} application={applicationState}></Application>
    ), document.getElementById('application-root'));
};
