const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats');
const homepath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/home/index.html';
const errorPagepath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/404.html';


function homeHandler(req, res){
	const pathname = url.parse(req.url).pathname;
	if(pathname == '/' && req.method == 'GET'){
		fs.readFile(homepath, function(err, data){
			if(err) {
				fs.readFile(errorPagepath, (err, data) => {
					if(err){
						res.write(JSON.stringify(err));
					} else {
						res.write(data);
					}
					res.end();
				})
			} else {
				res.write(data);
				res.end();
			}
		})
		return true;
	} 
}

module.exports = homeHandler;
