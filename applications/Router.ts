export default class Router {
    routes: IRouteIndex = {};
    defaultRoutes: IRoute[] = [];

    constructor(definitions?: IRouteQuickDefinition) {
        if (definitions) {
            this.addAll(definitions);
        }
    }

    handler = (event?: HashChangeEvent) => {
        var url = (event && event.newURL) ? event.newURL : window.location.href;
        var hash = getHash(url);
        var routes = this.routes;
        var routesCalled = 0;
        for (var route in routes) {
            if (routes.hasOwnProperty(route)) {
                var routeDef = routes[route];
                var params = hash.match(routeDef.regex);
                if (params) {
                    routesCalled++;
                    routeDef.enter.apply(routeDef.enter, params.slice(1));
                    // TODO: Should this break after it has been called?
                    //break;
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

    addAll(definitions?: IRouteQuickDefinition) {
        for (var index in definitions) {
            var definition = definitions[index];
            if (definition instanceof Array) {
                var routes = buildRouteGroup(index, definition);
                this.addRoutes(routes);
            } else {
                var route = buildRouteFromFunction(index, definition);
                this.addRoute(route);
            }
        }
    }

    add(route: string, enter: Function) {
        if (route) {
            this.routes[route] = {
                name: route,
                enter: enter,
                regex: new RegExp(route.replace(/\//g, "\\/").replace(/:(\w*)/g, "(\\w*)"))
            };
        } else {
            this.defaultRoutes.push({
                enter: enter
            });
        }
    }

    addRoute(route: IRoute) {
        this.routes[route.name] = route;
    }

    addRoutes(routes: IRoute[]) {
        for (var index = 0, length = routes.length; index < length; index++) {
            var route = routes[index];
            this.routes[route.name] = route;
        }
    }

    remove(route: string) {
        delete this.routes[route];
    }

    watchMethod(scope, name, prefix, callback) {
        var parameterNames = getParameterNames(callback);
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

export interface IRoute {
    name?: string;
    enter: Function;
    regex?: RegExp;
}

export interface IRouteIndex {
    [index: string]: IRoute;
}

export interface IRouteQuickDefinition {
    [index: string]: Function | Function[];
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function getParameterNames(functionHandle: Function) {
    var definition = functionHandle.toString().replace(STRIP_COMMENTS, '');
    return definition.slice(definition.indexOf('(') + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
}

function buildRegexFromDefinition(definition: string) {
    //    return new RegExp(definition.replace(/\//g, "\\/").replace(/:(\w*)/g, "(\\w*)"));
    return new RegExp('^' + definition.replace(/\//g, '\\/').replace(/:(\w*)/g, '([\^S\^\/]*)') + '$');
}

function buildRouteFromDefinition(definition: string, enter: Function): IRoute {
    return {
        name: definition,
        enter: enter,
        regex: buildRegexFromDefinition(definition)
    };
}

function buildRouteFromRegex(regex: RegExp, enter: Function): IRoute {
    return {
        name: regex.toString(),
        enter: enter,
        regex: regex
    };
}

function buildRouteFromFunction(prefix: string, enter: Function): IRoute {
    var params = getParameterNames(enter);
    params.unshift(prefix);
    var definition = params.join('/:');
    var regex = buildRegexFromDefinition(definition);
    return {
        name: definition,
        enter: enter,
        regex: regex
    };
}

function buildRouteGroup(prefix: string, entries: Function[]): IRoute[] {
    var routes: IRoute[] = [];
    for (var index = 0, length = entries.length; index < length; index++) {
        var entry = entries[index];
        routes.push(buildRouteFromFunction(prefix, entry));
    }
    return routes;
}

function getHash(url: string) {
    var hash;
    var index = url.indexOf('#');
    if (index >= 0) {
        hash = url.substring(index + 1);
    } else {
        hash = '';
    }
    return hash;
}
