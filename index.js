exports.default = function serialize(value) {

    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    switch (typeof value) {
        case 'object':
        case 'function':
        case 'symbol':

        switch (value.constructor) {

            case WeakMap:
            case WeakSet:
                return `${value.constructor.name}{}`;

            case Symbol:
                return value.toString();

            case Function:
            case RegExp:
                return `${value.constructor.name}{${value.toString()}}`;

            case Date:
                return `Date(${Number(value)})`;

            case Array:
                return `[${value.map(entry => serialize(entry)).join(',')}]`;

            case Set:
                var inner = [];
                value.forEach(entry => { inner.push(serialize(entry)); });
                return `Set{${inner.join(',')}}`;

            case Map:
                var inner = [];
                value.forEach((entry, key) => { inner.push(`${serialize(key)}:${serialize(entry)}`); });
                return `Map{${inner.join(',')}}`;

            default:
                return `${value.constructor !== Object ? 
                    `class ${value.constructor.name}` : ''}{${
                        Object.keys(value)
                        .map(key => `${serialize(key)}:${serialize(value[key])}`)
                        .join(',')}}`;
            }

        case 'number':
            return value;
        
        case 'string':
            return `"${value.replace('"','\\"')}"`;
        
        default:
            return '\0';
    }
}