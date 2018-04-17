console.log(__dirname);
console.log(__filename);

var foo = require('./foo');
var obj = require('./obj');
var chalk = require('chalk');

var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

// foo('啦啦啦啦啦');

// obj.foo('foo fff');

// try {
//     process.nextTick(function () {
//         throw new Error('opps~~~');
//     });
// } catch (error) {
//     console.log(error);
// }


// try {
//     throw new Error('opps~~~');
// } catch (error) {
//     console.log(error);
// }

// function async (cb, err, status) {
//     setTimeout(() => {
//         try {
//             if (status) {
//                 throw new Error('Opps~~~~');
//             } else {
//                 cb('done');
//             }
//         } catch (error) {
//             err(error);
//         }
//     }, 2000);
// }

// async(function (res) {
//     console.log('received: ', res);
// }, function (error) {
//     console.log('Error: async threw an exception: ', error);
// }, false);

// emitter.on('error', function (err) {
//     console.error('error', err.message);
// })
// emitter.emit('error', new Error('something is wrong...'));

// var logger = require('tracer').console();
// process.on('uncaughtException', function (err) {
//     // console.log('error caught in uncatchtException event: ', err);
//     logger.log(err)
//     // process.exit(1);
// });

// try {
//     setTimeout(() => {
//         throw new Error('Opps~~~');
//     }, 1);
// } catch (error) {
//     console.log(error);
// }

// var promise = new Promise(function (resolve, reject) {
//     reject(new Error('Opps~~~ promise rejected'));
//     // resolve('promise has been resolved...');
// });
// promise.then(function (result) {
//     console.log(chalk.blue(result));
// });

// process.on('unhandledRejection', function(err, p) {
//     console.log(err.stack);
// })

var http = require('http');

http.createServer(function (req, res) {
    var promise = new Promise (function (resolve, reject){
        reject(new Error('Broken...'));
    });
    promise.info = {url: req.url};
}).listen(9999);

process.on('unhandledRejection', function (err, p) {
    if (p.info && p.info.url) {
        console.log('error in URL: ', p.info.url);
    }
    console.log(err.stack);
});
