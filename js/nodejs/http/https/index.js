const https = require('https');
const fs = require('fs');

var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

var h = https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end('hello workd...');
}).listen('9910');
