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
                    return 'Circular{' + encountered.get(value) + '}';
                }

                encountered.set(value, count);
            }

            let keys, string = '';

            switch (value.constructor) {

                case Symbol:
                case Function:
                case RegExp:
                    return value.toString();
                case WeakMap:
                    return 'new WeakMap()';
                case WeakSet:
                    return 'new WeakSet()';
                case Date:
                    return 'new Date(' + Number(value) + ')';

                case Array:
                case Set:
                    keys = Object.keys(value);
                    if (value.constructor === Array && keys.length !== value.length) {
                        keys.sort(); // we only need this if an array contains object properties
                    }

                    for (const key of keys) {
                        string += recurse(value[key]) + ',';
                    }
                    return value.constructor === Set
                        ? 'new Set([' + string + '])'
                        : '[' + string + ']';

                case Map:
                    for (const [key, entry] of value) {
                        string += '[' + recurse(key) + ',' + recurse(entry) + ']';
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

                    for (const key of keys) {
                        string += recurse(key) + ':' + recurse(value[key]) + ',';
                    }
                    return '{' + string + '}';
            }

    })(value, circularSafe);

}
