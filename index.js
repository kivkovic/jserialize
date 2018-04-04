exports.default = function serialize(value, circularSafe = true, skipObjectKeySort = false) {

    const encountered = circularSafe && typeof WeakMap === 'function' ? new WeakMap() : null;
    let count = 0;

    return (function recurse(value) {

        if (value === null) return 'null';
            if (value === undefined) return 'undefined';
            if (value === Infinity) return 'Infinity';
            if (value !== value && isNaN(value)) return 'NaN';
            if (typeof value === 'number') return value;
            if (typeof value === 'string') return '"' + value.replace('"','\\"') + '"';

            if (typeof value !== 'object'
                && typeof value !== 'function'
                && typeof value !== 'symbol') {
                return '\0';
            }

            if (circularSafe && typeof value === 'object') {
                count++;

                if (encountered.has(value)) {
                    return '/*Circular*/' + encountered.get(value);
                }

                encountered.set(value, count);
            }

            let keys, values, string = '';

            switch (value.constructor) {

                case Symbol:
                    return 'Symbol()';

                case Function:
                case RegExp:
                    return value.toString();
                case WeakMap:
                    return 'new WeakMap()';
                case WeakSet:
                    return 'new WeakSet()';
                case Date:
                    return 'new Date(' + Number(value) + ')';

                case Set:
                    values = Array.from(value.values()).sort();
                    for (let i = 0; i < values.length; i++) {
                        string += recurse(values[i]) + (i < values.length - 1 ? ',' : '');
                    }
                    return 'new Set([' + string + '])';

                case Array:
                    keys = Object.keys(value);
                    if (keys.length !== value.length) {
                        keys.sort(); // we only need this if an array contains object properties
                    }

                    for (let i = 0; i < keys.length; i++) {
                        string += recurse(value[keys[i]]) + (i < keys.length - 1 ? ',' : '');
                    }

                    return '[' + string + ']';

                case Map:
                    keys = Array.from(value.keys());
                    for (let i = 0; i < keys.length; i++) {
                        string += '['
                            + recurse(keys[i])
                            + ','
                            + recurse(value.get(keys[i]))
                            + ']'
                            + (i < keys.length - 1 ? ',' : '');
                    }
                    return 'new Map([' + string + '])';

                case Error:
                case EvalError:
                case RangeError:
                case ReferenceError:
                case SyntaxError:
                case TypeError:
                case URIError:
                    return value.name + '(' + value.message + ')';

                default:
                    keys = Object.keys(value);
                    if (!skipObjectKeySort) keys.sort();

                    string = value.constructor !== Object ? ('/*class ' + value.constructor.name + '*/') : '';

                    for (let i = 0; i < keys.length; i++) {
                        string += keys[i].toString() // keys can be numbers, strings or symbols, per ecma-262
                            + ':'
                            + recurse(value[keys[i]])
                            + (i < keys.length - 1 ? ',' : '');
                    }
                    return '{' + string + '}';
            }

    })(value, circularSafe);

}
