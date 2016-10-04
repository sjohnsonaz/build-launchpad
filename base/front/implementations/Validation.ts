
export function required(target: any, propertyKey: string): any {
    return {
        enumerable: false,
        configurable: true,
        get: function() {
            !!this[propertyKey];
        }
    };
}

export function minLength(value: number) {

}

export function maxLength(value: number) {

}

export function regex(value: RegExp) {

}

export function custom() {

}
/*
    for (var index in rules) {
        if (rules.hasOwnProperty(index)) {
            switch (index) {
                case 'required':
                    required();
                    break;
                case 'minLength':
                    minLength(rules[index]);
                    break;
                case 'maxLength':
                    maxLength(rules[index]);
                    break;
                case 'regex':
                    regex(rules[index]);
                    break;
                case 'default':
                    //custom(rules[index]);
                    break;
            }
        }
    }
*/

export function validation<T>(rules: IValidationRules) {
    return function(target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<T>): any {
        return {
            enumerable: false,
            configurable: true,
            get: function() {
                this[propertyKey]
            }
        }
    }
}

export interface IValidationRules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    regex: RegExp;
}

export default class Validation {

}
