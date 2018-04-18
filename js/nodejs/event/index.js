
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

emitter.on('someEvent', function (e) {
    setTimeout(() => {
        console.log('something has happened later...');
    }, 1000);
    console.log('do something later...', e);
});

function f () {
    console.log('start...');
    emitter.emit('someEvent', {foo: 'bar'});
    console.log('end');
}

// f();

function Dog (name) {
    this.name = name;
}

// Dog.prototype.__proto__ = EventEmitter.prototype;

Dog.prototype = Object.create(EventEmitter.prototype);

var simon = new Dog('Aman');
simon.on('bark', function () {
    console.log(this.name, 'barked');
});

let index = 0;
let timer = setInterval(function () {
    if (index === 3) clearInterval(timer);
    simon.emit('bark');
    index++;
}, 1000);

/**
 * once
 */
emitter.once('hoo', function (message) {
    console.log('message: ', message);
});
emitter.emit('hoo', '1st time...');
emitter.emit('hoo', '2nd time...');
emitter.emit('hoo', '3rd time...');

// emitter.on('bar', function () {
//     console.log('event has triggered...');
// });

// setInterval(function () {
//     emitter.emit('bar');
// }, 1000);

// setTimeout(function () {
//     emitter.removeListener('bar');
// }, 3000);

// emitter.on('message', console.log);

// setInterval(function () {
//     emitter.emit('message', 'foo bar');
// }, 300);

// setTimeout(function () {
//     emitter.removeListener('message', console.log);
// }, 1000);
