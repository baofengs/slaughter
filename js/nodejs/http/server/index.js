const http = require('http');
const fs = require('fs');
const urlParse = require('url');

const server = new http.Server();
server.listen(9999, function () {
    console.log('listening...', 'http://localhost:9999');
});

server.on('request', function (request, response) {
    const url = urlParse.parse(request.url);
    if (url.path == '/') {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.write(JSON.stringify({foo: 'bar'}));
        response.end();
    } else if (url.path == '/test') {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.write('我去年没有买一个表');
        response.end();
    } else {
        const path = url.path;
        const fileName = path.substring(1);
        let type = '';
        switch (fileName.substring(fileName.lastIndexOf('.') + 1)) {
            case 'html':
                type = 'text/html; charset=utf-8';
                break;
            case 'css':
                type = 'text/css; charset=utf-8';
                break;
            case 'js':
                type = 'text/javascript; charset=utf-8';
                break;
            default:
                type = 'application/octet-stream; charset=utf-8';
                break;
        }
        fs.readFile(fileName, function (err, content) {
            if (err) {
                response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
                response.write(err.message);
                response.end();
            } else {
                response.writeHead(200, {'Content-Type': type});
                response.write(content);
                response.end();
            }
        })
    }
});
