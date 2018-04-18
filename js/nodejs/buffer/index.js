// var bytes = new Buffer(256);

// for (var i = 0, len = bytes.length; i < len; i++) {
//     bytes[i] = i;
// }

// console.log(bytes[10], bytes[109], typeof bytes[0]);

// var end = bytes.slice(240, 256);
// console.log(end[0]);

// var more = new Buffer(4);
// bytes.copy(more, 0, 4, 8)
// console.log(more[0]);

// var hello = new Buffer([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
// console.log(hello.toString());

// var foo = new Buffer('world')
// console.log(foo.toString());

// var bar = new Buffer('Hellox');
// var baz = new Buffer(bar);
// console.log(baz.toString());

// var blank = new Buffer(' 1 ');
// console.log(blank.length);


// var fs = require('fs');
// var bufferSize = 1024;
// var buffer = new Buffer(bufferSize);
// var readSize = fs.readSync(fs.openSync('/dev/tty', 'r'), buffer, 0, bufferSize);
// var chunk = buffer.toString('utf8', 0, readSize);

// console.log('Input: ', chunk);

var encode = Buffer.isEncoding('utf8');
console.log(encode);

var buf = new Buffer('is buffer');
var date = new Date();
console.log('buf is Buffer?: ', Buffer.isBuffer(buf), 'date is Buffer?: ', Buffer.isBuffer(date));

console.log(Buffer.byteLength('Hello', 'utf8'));

var bf1 = new Buffer('hello');
var bf2 = new Buffer(' ');
var bf3 = new Buffer('world');

var hw = Buffer.concat([bf1, bf2, bf3], 10).toString();
console.log(hw)

var buf = new Buffer(1234);
// buf[1233] = 123;
// buf[1234] = 123;
// buf[1235] = 123;
// console.log(buf.length, buf[1235], buf[1234], buf[1233]);

buf.write('He');
buf.write('l', 2);
buf.write('lo', 2);
console.log(buf.toString());

var buf = new Buffer('test');
var json = JSON.stringify(buf);
console.log(json)

var copy = new Buffer(JSON.parse(json));
console.log(copy)

var dns = require('dns')
dns.lookup(`sanbaofengs.com`, 4, (err, address) => {
    console.log(address);
});
