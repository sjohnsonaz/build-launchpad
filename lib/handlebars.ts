declare var HandlebarsIntl: any;
import * as exphbs from 'express-handlebars';

export default function(app) {
    var hbs = exphbs.create({
        defaultLayout: 'layout',
        helpers: {
            json: function(object) {
                return object ? JSON.stringify(object) : "null";
            },
            section: function(name, options) {
                if (!this._sections) {
                    this._sections = {};
                }
                this._sections[name] = options.fn(this);
                return null;
            },
            console: function(object) {
                console.log(object);
            },
            typeof: function(object) {
                return typeof object;
            },
            keys: function(object) {
                return Object.keys(object);
            },
            iftext: function(object, ifTrue, ifFalse) {
                if (object) {
                    return ifTrue;
                } else {
                    return ifFalse;
                }
            }
        }
    });
    app.engine(hbs.extname, hbs.engine);
    app.set('view engine', hbs.extname);
    return hbs;
};
