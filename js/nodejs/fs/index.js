var fs = require('fs');

function fileDemo (name) {
    this.name = name;
}

/**
 * readFile
 */
fileDemo.prototype.readFile = function () {
    fs.readFile(this.name, function (err, buffer) {
        if (err) throw err;
        console.log('readFile: ', buffer.toString());
    });
}

/**
 * readFileSync
 */
fileDemo.prototype.readFileSync = function () {
    const text = fs.readFileSync(this.name, 'utf8');
    console.log('readFileSync: ', text);
}

/**
 * get new line type
 */
fileDemo.prototype.newLine = function () {
    const text = fs.readFileSync(this.name);
    return text.indexOf('\r\n') >= 0 ? '\\r\\n' : '\\n';
}

/**
 * writeFile
 */
fileDemo.prototype.writeFile = function (content) {
    fs.writeFile(this.name, content, (err) => {
        if (err) throw err;
        console.log(this.name, 'has saved...');
    });
}

/** 
 * writeFileSync
 */
fileDemo.prototype.writeFileSync = function (content) {
    fs.writeFileSync(this.name, content);
}

/**
 * exists
 */
fileDemo.prototype.exists = function (file) {
    fs.exists(file, function (exists) {
        console.log(exists);
        return exists;
    });
}

/**
 * existsSync
 */
fileDemo.prototype.existsSync = function (file) {
    return fs.existsSync(file);
}

/**
 * delete dir if exists
 */
fileDemo.prototype.delIfExists = function (file) {
    if (this.existsSync(file)) {
        console.log(file, 'remoted...');
        fs.rmdirSync(file);
    }
}

/**
 * mkdir
 */
fileDemo.prototype.mkdir = function (name, mod) {
    this.delIfExists(name);
    fs.mkdir(name, mod, function (err) {
        if (err) throw err;
    });
}

/**
 * readDir
 */
fileDemo.prototype.readdir = function (dir) {
    fs.readdir(dir, function (err, files) {
        if (err) throw err;
        console.log(files);
        // var count = files.length;
        // var results = [];
        // files.forEach(function (file) {
        //     fs.readFile(file, function (data) {
        //         results[file] = data;
        //         count--;
        //         if (count <= 0) {
        //             // 处理文件
        //             console.log(results);
        //         }
        //     })
        // });
    });
}

/**
 * stat
 */
fileDemo.prototype.stat = function (file) {
    fs.readdir(file, function (err, files) {
        if (err) throw err;
        files.forEach(fileName => {
            fs.stat('./' + fileName, function (err, stats) {
                if (err) err;
                if (stats.isFile()) {
                    console.log("%s is file", fileName);
                } else if (stats.isDirectory()) {
                    console.log("%s is directory", fileName);
                }
                // console.log('stat: ', JSON.stringify(stats));
            })
        })
    });
}

/**
 * watchFile
 */
fileDemo.prototype.watchFile = function (file) {
    fs.watchFile(file, function (curr, prev) {
        console.log('the current mtime is: ', new Date(curr.mtime));
        console.log('the previous mtime is: ', new Date(prev.mtime));
    });
}

/** 
 * createReadStream
 */
fileDemo.prototype.createReadStream = function (file) {
    function readLines (input, func) {
        var remaining = '';
        input.on('data', function (data) {
            remaining += data;
            var index = remaining.indexOf('\n');
            var last = 0;
            while (index > -1) {
                var line = remaining.substring(last, index);
                last = index + 1;
                func(line);
                index = remaining.indexOf('\n', last);
            }
        });
        input.on('end', function () {
            if (remaining.length > 0) {
                func(remaining);
            }
        })
    }
    function func (data) {
        console.log('Line: ', data, '\n');
    }
    var input = fs.createReadStream('foo.md');
    readLines(input, func);
}

/**
 * fileCopy
 */
fileDemo.prototype.fileCopy = function (fileA, fileB, done) {
    const input = fs.createReadStream(fileA);
    const output = fs.createWriteStream(fileB);
    
    input.on('data', function (data) {
        output.write(data);
    });
    input.on('error', function (err) {
        if (err) throw err;
    });
    input.on('end', function () {
        output.end();
        if (done) done();
    });
}



const foo = new fileDemo('./foo.md');
// foo.readFile();
// foo.readFileSync();
// console.log(foo.newLine());
// foo.writeFile('# something has been written...');
// foo.writeFileSync('# foo...')
// foo.exists('foo.md');
// foo.exists('bar.md');
// foo.delIfExists('foo')
// foo.mkdir('foo', 0777)
// foo.readdir(process.cwd());
// foo.stat(process.cwd());
// foo.watchFile('foo.md')
// foo.createReadStream()
foo.fileCopy('foo.md', 'bar.md', function () {
    console.log('copy done...');
});
