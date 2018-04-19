const foo = require('./foo.js');

const emit = require('./emit');

emit.on('ready', (msg) => {
    console.log(msg);
});

var xEd = foo.addX(5);
// console.log(module);
console.log();

var net = require('net');
var fs = require('fs');

function recv(socket, data) {
    if (data === 'quit') {
        socket.end('Bye!\n');
        return;
    }

    request({ uri: baseUrl + data }, function (error, response, body) {
        if (body && body.length) {
            $ = cheerio.load(body);
            socket.write($('#mw-content-text p').first().text() + '\n');
        } else {
            socket.write('Error: ' + response.statusCode);
        }
        socket.write(ps1);
    });
}
var port = 1081;
var logo = fs.readFileSync('foo.js');
var ps1 = '\n\n>>> ';

net.createServer(function (socket) {
    socket.write(logo);
    socket.write(ps1);
    socket.on('data', recv.bind(null, socket));
}).listen(port);
