function serialize(value) {
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


//////////////////

class A {
	constructor(a) {
		this.a = a;
		this.b = () => a + 5;
		this.d = new Set([1,2,3,{a: /a/i}],"aaaaa","bbbbbbb");
		this.e = new Map([['a',100],['b',200]]);
		this.f = new Date();
		this.g = new RegExp('ab.*c', 'gi');
		this.h = [1,2,3,new Date(), {a: Symbol('abc')}, "dddddddd"];
		this.i = new WeakMap();
		// TODO:
		// does prop order matter?
		// reduce number of calls in hash, maybe immediatelly stringify if primitive
		// arraybuffer
		// setiterator
		// mapiterator
		// general iterator...?
	}

	c() {
		return 2;
	}
}

const list = [];
for (let i = 0; i < 100000; i++) { // 12s
	list.push(new A(i));
}

const start = +new Date;
for (let i = 0; i < list.length; i++) {
	serialize(list[i]);
}
console.log('Time:', +new Date - start);

const first = new A(0);
//const second = new A(0);
//first.a = 1;
//first.b = 2;
//second.b = 1;
//second.b = 2;

console.log(serialize(first));
//console.log(hash(second));