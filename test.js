const serialize = require('./index.js').default;

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
        this.j = {  
           a:{  
              a:{  
                 a:{  
                    a:{a:1,b:2,c:3,d:4},
                    b:[  
                       {  
                          a:{a:1,b:2,c:3,d:4},
                          b:[  
                             { a:{a:1,b:2,c:3,d:4}, b:[1,2,3], c:1 },
                             { a:{a:1,b:2,c:3,d:4}, b:[4,5,6], c:1 },
                             { a:{a:1,b:2,c:3,d:4}, b:[7,8,9], c:1 },
                             { a:{a:1,b:2,c:3}, b:[10,11,12], c:1 },
                             { a:{a:1,b:2}, b:[13,14,15,16,17,18], c:1 }
                          ],
                          c:1
                       },
                       {  
                          a:{a:1,b:2,c:3,d:4},
                          b:[ { a:{a:1,b:2,c:3,d:4}, b:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], c:1 } ],
                          c:1
                       }
                    ],
                    c:1
                 },
                 b:[  
                    { a:{a:1,b:2,c:3,d:4}, b:[1,2,3,4,5,6,7,8,9,10,11,12,13], c:1 },
                    { a:{}, b:[1,2,3,4,5,6,7,8,9,10,11,12,13,14], c:1 }
                 ],
                 c:1
              },
              b:[  
                 {  
                    a:{},
                    b:[  
                       { a:{a:1,b:2,c:3,d:4}, b:[2,3,4,5,6,7,8,9,10,11,12,13,14,15], c:1 },
                       { a:{}, b:[3,4,5,6,7,8,9,10,11,12,13,14,15], c:1 }
                    ],
                    c:1
                 },
                 { a:{a:1,b:2,c:3,d:4}, b:[4,5,6,7,8,9,10,11,12,13,14,15], c:1 },
                 { a:{}, b:[5,6,7,8,9,10,11,12,13,14,15], c:1 },
                 { a:{a:1,b:2,c:3,d:4}, b:[6,7,8,9,10,11,12,13,14,15], c:1 }
              ],
              c:1
           },
           b:[1,2,3,4,5,6,7,8,9,10],
           c:1
        };
    }

    c() {
        return 2;
    }
}

const list = [];
for (let i = 0; i < 10000; i++) {
    list.push(new A(i + Math.random()));
}

let results = [];
let start = +new Date;

for (let i = 0; i < list.length; i++) {
    results.push(serialize(list[i]));
}

console.log('jserialize time:', +new Date - start);

results = [];
start = +new Date;

for (let i = 0; i < list.length; i++) {
    results.push(JSON.stringify(list[i]));
}

console.log('JSON time:', +new Date - start);

const first = new A(0);
console.log(serialize(first));

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