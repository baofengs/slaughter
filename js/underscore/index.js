console.log(_.VERSION);

const obj1 = {
    name: 'foo',
    age: 12
}

const obj2 = {
    name: 'bar',
    weight: 55
}

// console.log(_.extend(obj1, obj2));
// console.log(_.extendOwn(obj1, obj2));
// console.log(_.defaults(obj1, obj2));

console.log(_.allKeys(obj1));
console.log(_.keys(obj1));
