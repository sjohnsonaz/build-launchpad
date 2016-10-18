export interface IRoute {
    route?: string;
    enter: Function;
    exit?: Function;
    regex?: RegExp;
}

export interface IRouteIndex {
    [index: string]: IRoute;
}

export interface IRouteQuickDefinition {
    [index: string]: Function;
}

export default class Router {
    static STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    routes: IRouteIndex = {};
    defaultRoutes: IRoute[] = [];

    private getParameterNames(functionHandle: Function) {
        var definition = functionHandle.toString().replace(Router.STRIP_COMMENTS, '');
        return definition.slice(definition.indexOf('(') + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
    }

    constructor(routes?: IRouteQuickDefinition) {
        if (routes) {
            for (var index in routes) {
                var entry = routes[index];
                this.add(index, entry);
            }
        }
    }

    handler = (event?: HashChangeEvent) => {
        var url = (event && event.newURL) ? event.newURL : window.location.href;
        var routes = this.routes;
        var routesCalled = 0;
        for (var route in routes) {
            if (routes.hasOwnProperty(route)) {
                var routeDef = routes[route];
                var params = url.match(routeDef.regex);
                if (params) {
                    routesCalled++;
                    routeDef.enter.apply(routeDef.enter, params.slice(1));
                    break;
                }
            }
        }
        if (!routesCalled) {
            for (var index = 0, length = this.defaultRoutes.length; index < length; index++) {
                var defaultRouteDef = this.defaultRoutes[index];
                defaultRouteDef.enter.apply(defaultRouteDef.enter);
            }
        }
    }

    listen() {
        window.addEventListener('hashchange', this.handler);
        this.handler();
    }

    stop() {
        window.removeEventListener('hashchange', this.handler);
    }

    add(route: string, enter: Function, exit?: Function) {
        if (route) {
            this.routes[route] = {
                route: route,
                enter: enter,
                exit: exit,
                regex: new RegExp(route.replace(/\//g, "\\/").replace(/:(\w*)/g, "(\\w*)"))
            };
        } else {
            this.defaultRoutes.push({
                enter: enter,
                exit: exit
            });
        }
    }

    remove(route) {
        delete this.routes[route];
    }

    watchMethod(scope, name, prefix, callback) {
        var parameterNames = this.getParameterNames(callback);
        parameterNames.unshift(prefix);
        this.add('#/' + parameterNames.join('/:'), function() {
            callback.apply(scope, arguments);
        });
        var handle = function() {
            var parameterValues = Array.prototype.slice.call(arguments);
            parameterValues.unshift(prefix);
            window.location.hash = '#/' + parameterValues.join('/');
            return window.location.hash;
        };
        scope[name] = handle;
        return handle;
    }

    defaultRoute(scope, callback) {
        this.add('', function() {
            callback.apply(scope, arguments);
        });
    }

    go() {

    }
}
