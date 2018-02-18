exports.default = function serialize(value) {

    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value === Infinity) return 'Infinity';
    if (value !== value && isNaN(value)) return 'NaN';
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return `"${value.replace('"','\\"')}"`;

    if (typeof value !== 'object'
        && typeof value !== 'function'
        && typeof value !== 'symbol') {
        return '\0';
    }

    switch (value.constructor) {

        case Symbol:   return value.toString();
        case WeakMap:  return `WeakMap{}`;
        case WeakSet:  return `WeakSet{}`;
        case Function: return `Function{${value.toString()}}`;
        case RegExp:   return `RegExp{${value.toString()}}`;
        case Date:     return `Date(${Number(value)})`;
        case Array:    return `[${value.map(entry => serialize(entry)).join(',')}]`;

        case Set:
            var inner = [];
            value.forEach(entry => { inner.push(serialize(entry)); });
            return `Set{${inner.join(',')}}`;

        case Map:
            var inner = [];
            value.forEach((entry, key) => { inner.push(`${serialize(key)}:${serialize(entry)}`); });
            return `Map{${inner.join(',')}}`;

        default:
            const prefix = value.constructor !== Object ? `class ${value.constructor.name}` : '';
            return `${prefix}{${Object.keys(value)
                .map(key => `${serialize(key)}:${serialize(value[key])}`)
                .join(',')}}`;

    }
}
