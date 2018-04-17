const path = require('path');

console.log('__dirname: ', __dirname);

const join = path.join(__dirname, 'foo');
console.log('join: ', join);

/**
 * resolve
 */
const fs = path.resolve('../', 'fs');
console.log('fs: ', fs);

const fs1 = path.resolve('foo/bar', '../baz');
console.log('fs1', fs1);

/**
 * relative
 */
const relatived = path.relative('/Users/bjhl/projects/github/slaughter/js/path', '/Users');
console.log(relatived);

/** 
 * parse
 */
const file = path.resolve('../fs', '/foo.md');
const parsed = path.parse(file);

console.log('base: ', parsed.base, 'name: ', parsed.name, 'ext: ', parsed.ext, JSON.stringify(parsed));
