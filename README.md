# jserialize

Tiny serializer for JS. Returns a compressed JSON-like string, trying to include every possible special internal JS type usually skipped by other serialization methods. The indended use is for:
- comparing deep-value equality of objects
- generating an object hash based on full internal state of an object
- logging object values, including those normally skipped by `JSON.stringify`

## Example

```javascript

const serialize = require('jserialize').default;

class Class1 {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

class Class2 {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

const function1 = () => 1;
const function2 = () => 2;

const a = new Class1(1, function1);
const b = new Class1(1, function1);
const c = new Class1(1, function2);
const d = new Class2(1, function1);

console.log(JSON.stringify(a) === JSON.stringify(b)); // true
console.log(JSON.stringify(a) === JSON.stringify(c)); // true, same object shape
console.log(JSON.stringify(a) === JSON.stringify(d)); // true, same object shape

console.log(serialize(a) === serialize(b)); // true
console.log(serialize(a) === serialize(c)); // false, different this.b function body
console.log(serialize(a) === serialize(d)); // false, different class type

```

Supports various special cases not handled by most serialization methods, such as `JSON.stringify`, including:
- Class intances - unlike with native objects, instance class name is prefixed to the serialized value
- functions (different representations are used for arrow and for regular functions)
- `Map` and `Set` (including their contents)
- `WeakMap` and `WeakSet` (due to intentional internal restrictions, contents can't be serialized)
- `Date`, `RegExp` and `Symbol`
- `NaN` and `Infinity` (cast to `null` in native JSON serialization)
- `undefined` (normally omitted from serialization)
- built-in `Error` types (normally serialized to empty object string)
- nested (recursive) object references

## API

- `jserialize.serialize(object)` - returns the full internal representation of an object, as a string
