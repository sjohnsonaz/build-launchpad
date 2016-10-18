export function getArgumentNames(func: Function) {
    // First match everything inside the function argument parens.
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(value: string, index: number, array: string[]) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return value.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(value: string, index: number, array: string[]) {
        // Ensure no undefined values are added.
        return !!value;
    });
}
