const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime');
const { contentTypes } = require('../config/constants.enum');

function getContentType(filename) {
    const extention = path.extname(filename);
    return contentTypes[extention];
}

function staticFileHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    if(pathname.startsWith('/content') && req.method == 'GET') {
        fs.readFile(`./${pathname}`, (err, data) => {
            if(err) {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
                return;
            }
            const filename = pathname.replace(/^.*[\\\/]/, '')
            const fileExtension = path.extname(filename);
            const mimeType = mime.getType(fileExtension);
            res.writeHead(200, {
                'Content-Type': mimeType
            });
            res.end(data);
        })
    } else {
        return true;
    }
}
module.exports = staticFileHandler;