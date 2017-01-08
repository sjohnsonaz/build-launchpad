import Router, { route, middleware } from './Router';
import Gateway from './Gateway';

export default class Service<T extends Gateway<any>> extends Router {
    gateway: T
    constructor(base: string, gateway: T) {
        super(base);
        this.gateway = gateway;
    }
}
