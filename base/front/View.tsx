import * as React from 'react';
import {observer} from 'mobx-react';

@observer
export class ViewHeader<P, S> extends React.Component<P, S> {

}

@observer
export class ViewBody<P, S> extends React.Component<P, S> {

}

@observer
export class ViewFooter<P, S> extends React.Component<P, S> {

}

export default class View<T extends ViewHeader<any, any>, U extends ViewBody<any, any>, V extends ViewFooter<any, any>> {
    header: T;
    body: U;
    footer: V;

    constructor(header: T, body: U, footer: V) {
        this.header = header;
        this.body = body;
        this.footer = footer;
    }
}