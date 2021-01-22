const fs = require('fs');
const path = require('path');
const url = require('url');
const { contentTypes } = require('../config/constants.enum');

function getContentType(filename) {
    const extention = path.extname(filename);
    return contentTypes[extention];
}

function staticFileHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    if(pathname.startsWith('content') && req.method == 'GET') {
        fs.readFile(`./${pathname}`, 'utf8', (err, data) => {
            if(err) { 
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': `${getContentType(pathname)}`
                });
                res.write(data);
                res.end()
            }
        })
    }
}
module.exports = staticFileHandler;