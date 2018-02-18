exports.default = function serialize(value) {

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

    let string = '';

    switch (value.constructor) {

        case Symbol:   return value.toString();
        case WeakMap:  return 'WeakMap{}';
        case WeakSet:  return 'WeakSet{}';
        case Function: return 'Function{' + value.toString() + '}';
        case RegExp:   return 'RegExp{' + value.toString() + '}';
        case Date:     return 'Date(' + Number(value) + ')';

        case Array:
            for (const entry of value) {
                string += serialize(entry) + ',';
            }
            return '[' + string + ']';

        case Set:
            for (const key in value) {
                string += serialize(entry) + ',';
            }
            return 'Set{' + string + '}';

        case Map:
            for (const [key, entry] in value) {
                string += serialize(key) + ':' + serialize(entry) + ',';
            }
            return 'Map{' + string + '}';

        case Error:
        case EvalError:
        case RangeError:
        case ReferenceError:
        case SyntaxError:
        case TypeError:
        case URIError:
            return 'Error{' + value.toString() + '}';

        default:
            string = value.constructor !== Object ? ('class ' + value.constructor.name) : '';
            for (const key in value) {
                string += serialize(key) + ':' + serialize(value[key]) + ',';
            }
            return '{' + string + '}';
    }
}
