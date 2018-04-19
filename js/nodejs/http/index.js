const http = require('http');
const fs = require('fs');
const url = require('url');
// const EventEmitter = require('events').EventEmitter;
// const emitter = new EventEmitter();

/**
 * common
 * @param {*} data 
 */
const listening = function (data) {
    console.log(`${data.typeStr} - http://127.0.0.1:${data.port}`);
}

/**
 * demo 01
 */
var http1 = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('hello workd...');
    // setTimeout(() => {
    //     response.write('hello workd...');
    // }, 100);
    // emitter.on('data', function (data) {
    //     response.write('data: ', data)
    // });
    // var i = 0;
    // setInterval(function () {
    //     emitter.emit('data', i++);
    // }, 1000);
    response.end();
}).listen(9990, listening({typeStr: 'demo1', port: 9990}));

/**
 * file server
 */
const fileServer = http.createServer(function (request, response) {
    fs.readFile('./data.json', function (err, data) {
        // response.writeHead(200, {'Content-Type': 'application/json'});
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(data);
        response.end();
    });
}).listen(9991, listening({typeStr: 'fileServer', port: 9991}));

/**
 * file server: createReadStream
 */
const fileServer1 = http.createServer(function (request, response) {
    fs.createReadStream('./data.json').pipe(response);
}).listen(9992, listening({typeStr: 'fileServer1', port: 9992}));


/**
 * response based on path
 */
const pathServer = http.createServer(function (request, response) {
    try {
        if (request.url == '/') {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            fs.createReadStream('./index.html').pipe(response);
            // response.end();
        } else if (request.url == '/data') {
            fs.readFile('./data.json', function (err, data) {
                if (err) throw err;
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.write(data);
                response.end();
            });
        } else {
            const page404 = fs.readFileSync('./404.html');
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(page404);
            response.end();
        }
    } catch (err) {
        console.log(err);
    }
}).listen(9993, listening({typeStr: 'pathStever', port: 9993}));

/**
 * request
 */
const showRequestServer = http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write(JSON.stringify(
        {
            request: {
                url: request.url,
                method: request.method,
                headers: request.headers
            },
            pasedUrl: {
                url: url.parse(request.url)
            }
        }
    ));
    response.end();
}).listen(9994, listening({typeStr: 'showRequestServer', port: 9994}));

/** 
 * request addEventListener
 */
const queryString = require('querystring');
const requestListener = http.createServer(function (request, response) {
    var postData = '';
    try {
        request.addListener('data', function (postDataChunk) {
            postData += postDataChunk;
        });
        request.addListener('end', function () {
            response.writeHead(200, { 'Content-Type': 'text/plain'});
            console.log(queryString.parse(postData).text)
            console.log(postData)
            response.write('foo');
            response.end();
        });
    } catch (err) {
        console.log(err);
    }
}).listen(9995, listening({'typeStr': 'requestListener',  port: 9995}));

http.createServer(function (req, res) {
    var content = "";

    req.on('data', function (chunk) {
        console.log(chunk);
        content += chunk;
    });

    req.on('end', function () {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("You've sent: " + content);
        res.end();
    });

}).listen(9996);

/**
 * upload...
 */
var destinationFile = '',
    fileSize = '',
    uploadBytes = '';
const upload = http.createServer(function (request, response) {
    response.writeHead(200);
    destinationFile = fs.createWriteStream('foo');
    request.pipe(destinationFile);
    fileSize = request.headers['content-length'];
    uploadBytes = 0;
    request.on('data', function (data) {
        uploadBytes += data.length;
        var p = (uploadBytes / fileSize) * 100;
        response.write('uploading...' + parseInt(p, 0) + "%\n");
    });
    request.on('end', function () {
        response.end('file upload complete');
    })
}).listen(9997, listening({typeStr: 'upload', port: 9997}));

console.log('=====');

/** ===== GET ===== */
const getData = function () {
    return http.get({
        host: '127.0.0.1',
        port: '9993',
        path: '/data'
    }, function (response) {
        // console.log(response);
        var body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            var parsed = JSON.parse(body);
            console.log(parsed);
        })
    });
}

getData();

/**
 * request
 */
var postData = queryString.stringify({
    'msg': 'hello world~'
});

var options = {
    host: 'localhost',
    port: 9997,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

var req = http.request(options, function (res) {
    console.log('Status: ', res.statusCode);
    console.log('Headers: ', JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('Body: ', chunk);
    });
});

req.on('error', function (e) {
    console.log('error: ', e.message);
});
req.write(postData);
req.end();
