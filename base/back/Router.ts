import * as express from 'express';

import {getArgumentNames} from '../util/FunctionUtil';

export type RouteVerb = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Middleware = express.RequestHandler | express.RequestHandler[];

export function wrapMethod(method: Function) {
    var argumentNames = getArgumentNames(method);
    var wrappedMethod = function(req: express.Request, res: express.Response, next: express.NextFunction) {
        var args = [];
        for (var index = 0, length = argumentNames.length; index < length; index++) {
            var argumentName = argumentNames[index];
            var arg = req.params[argumentName] || req.query[argumentName] || req.body[argumentName];
            args.push(arg);
        }
    }
}

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

    addDefinition(methodName: string, verb: RouteVerb, name: string | RegExp, pipeArgs: boolean = false) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].verb = verb;
        this.routeNames[methodName].name = name;
        this.routeNames[methodName].pipeArgs = pipeArgs;
    }

    build(router: express.IRouter<express.Router>, controller: Object) {
        if (this.parent) {
            this.parent.build(router, controller);
        }
        for (var index in this.routeNames) {
            if (this.routeNames.hasOwnProperty(index)) {
                var routeName = this.routeNames[index];
                var middleware = routeName.middleware;
                var method = controller[index];
                if (method) {
                    method = method.bind(controller);
                }
                switch (routeName.verb) {
                    case 'all':
                        router.all(routeName.name, ...middleware, method);
                        break;
                    case 'get':
                        router.get(routeName.name, ...middleware, method);
                        break;
                    case 'post':
                        router.post(routeName.name, ...middleware, method);
                        break;
                    case 'put':
                        router.put(routeName.name, ...middleware, method);
                        break;
                    case 'delete':
                        router.delete(routeName.name, ...middleware, method);
                        break;
                    case 'patch':
                        router.patch(routeName.name, ...middleware, method);
                        break;
                    case 'options':
                        router.options(routeName.name, ...middleware, method);
                        break;
                    case 'head':
                        router.head(routeName.name, ...middleware, method);
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

export function route(verb: RouteVerb, name: string | RegExp, pipeArgs: boolean = false) {
    return function(target: Router, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        var routeBuilder = getRouteBuilder(target);
        routeBuilder.addDefinition(propertyKey, verb, name);
    }
}

export function middleware(middleware: Middleware) {
    return function(target: Router, propertyKey: string, descriptor: TypedPropertyDescriptor<express.RequestHandler>) {
        var routeBuilder = getRouteBuilder(target);
        routeBuilder.addMiddleware(propertyKey, middleware);
    }
}

export default class Router {
    routeBuilder: RouteBuilder;
    expressRouter: express.IRouter<express.Router>;
    constructor() {
        this.expressRouter = express.Router();
        this.build();
    }
    build() {
        this.routeBuilder.build(this.expressRouter, this);
    }
}
