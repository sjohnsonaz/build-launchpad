import * as express from 'express';

export type RouteMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export type Middleware = express.RequestHandler | express.RequestHandler[];

export class RouteDefinition {
    method: RouteMethod;
    name: string | RegExp;
    middleware: Middleware[] = [];
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

    addDefinition(methodName: string, method: RouteMethod, name: string | RegExp) {
        if (!this.routeNames[methodName]) {
            this.routeNames[methodName] = new RouteDefinition();
        }
        this.routeNames[methodName].method = method;
        this.routeNames[methodName].name = name;
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
                switch (routeName.method) {
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

export function route(method: RouteMethod, name: string | RegExp) {
    return function(target: Router, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.routeBuilder) {
            if (!target.hasOwnProperty('routeBuilder')) {
                target.routeBuilder = new RouteBuilder(target.routeBuilder);
            }
        } else {
            target.routeBuilder = new RouteBuilder();
        }
        target.routeBuilder.addDefinition(propertyKey, method, name);
    }
}

export function middleware(middleware: Middleware) {
    return function(target: Router, propertyKey: string, descriptor: PropertyDescriptor) {
        if (target.routeBuilder) {
            if (!target.hasOwnProperty('routeBuilder')) {
                target.routeBuilder = new RouteBuilder(target.routeBuilder);
            }
        } else {
            target.routeBuilder = new RouteBuilder();
        }
        target.routeBuilder.addMiddleware(propertyKey, middleware);
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
