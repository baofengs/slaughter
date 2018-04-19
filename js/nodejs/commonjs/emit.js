var emitter = require('events').EventEmitter;
module.exports = new emitter();

setTimeout(function () {
    module.exports.emit('ready', 'readied');
}, 2000);
