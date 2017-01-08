import * as express from 'express';

declare global {
    export var req: express.Request;
    export var res: express.Response;
    export var next: express.NextFunction;
}

import { getArgumentNames, wrapMethod } from '../util/FunctionUtil';

export type RouteVerb = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Middleware = express.RequestHandler | express.RequestHandler[];

export class RouteDefinition {
    verb: RouteVerb;
    name: string | RegExp;
    middleware: Middleware[] = [];
    pipeArgs: boolean = false;
}

export interface RouteNames {
    [index: string]: RouteDefinition;
}

export class RouteBuilder {
    routeNames: RouteNames = {};
    parent: RouteBuilder;
    constructor(parent?: RouteBuilder) {
        this.parent = parent;
    }

    addMiddleware(methodName: string, middleware: Middleware) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].middleware.push(middleware);
    }

    addDefinition(methodName: string, verb: RouteVerb, name: string | RegExp, pipeArgs: boolean = true) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].verb = verb;
        this.routeNames[methodName].name = name;
        this.routeNames[methodName].pipeArgs = pipeArgs;
    }

    baseRoutes: RouteVerb[] = ['all', 'get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

    build(router: express.IRouter<express.Router>, controller: Router) {
        if (this.parent) {
            this.parent.build(router, controller);
        }
        for (var index in this.routeNames) {
            if (this.routeNames.hasOwnProperty(index)) {
                var routeName = this.routeNames[index];
                var middleware = routeName.middleware;
                var name = routeName.name;
                var verb = routeName.verb;
                if (this.baseRoutes.indexOf(index as any) >= 0) {
                    if (!verb) {
                        verb = index as any;
                    }
                    if (!name) {
                        name = '/' + controller.getBase() + '/';
                    }
                }
                if (!name) {
                    name = '/' + controller.getBase() + '/' + index + '/';
                }
                var method = controller[index];
                if (method) {
                    if (routeName.pipeArgs) {
                        name = name + getArgumentNames(method).map(function (value) {
                            return ':' + value;
                        }).join('/');
                        console.log(name);
                        method = wrapMethod(method, controller);
                    } else {
                        method = method.bind(controller);
                    }
                }
                switch (verb) {
                    case 'all':
                        router.all(name, ...middleware, method);
                        break;
                    case 'get':
                        router.get(name, ...middleware, method);
                        break;
                    case 'post':
                        router.post(name, ...middleware, method);
                        break;
                    case 'put':
                        router.put(name, ...middleware, method);
                        break;
                    case 'delete':
                        router.delete(name, ...middleware, method);
                        break;
                    case 'patch':
                        router.patch(name, ...middleware, method);
                        break;
                    case 'options':
                        router.options(name, ...middleware, method);
                        break;
                    case 'head':
                        router.head(name, ...middleware, method);
                        break;
                }
            }
        }
    }
}

function getRouteBuilder(target: Router) {
    if (target.routeBuilder) {
        if (!target.hasOwnProperty('routeBuilder')) {
            target.routeBuilder = new RouteBuilder(target.routeBuilder);
        }
    } else {
        target.routeBuilder = new RouteBuilder();
    }
    return target.routeBuilder;
}

export function route(verb?: RouteVerb, name?: string | RegExp, pipeArgs: boolean = true) {
    return function (target: Router, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        var routeBuilder = getRouteBuilder(target);
        routeBuilder.addDefinition(propertyKey, verb, name, pipeArgs);
    }
}

export function middleware(middleware: Middleware) {
    return function (target: Router, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        var routeBuilder = getRouteBuilder(target);
        routeBuilder.addMiddleware(propertyKey, middleware);
    }
}

export default class Router {
    base: string;
    routeBuilder: RouteBuilder;
    expressRouter: express.IRouter<express.Router>;
    constructor(base: string) {
        this.base = base;
        this.expressRouter = express.Router();
        this.build();
    }
    build() {
        this.routeBuilder.build(this.expressRouter, this);
    }
    getBase() {
        if (this.base) {
            return this.base;
        } else {
            var name = (this.constructor as any).name;
            if (name) {
                var results = name.match(/(.*)([sS]ervice|[rR]oute)/);
                if (results && results[1]) {
                    name = results[1].toLowerCase();
                }
            }
            return name;
        }
    }
}
