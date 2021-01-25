const url = require('url');
const fs = require('fs');
const path = require('path');
const homepath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/home/index.html';
const errorPagepath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/404.html';

const makeCatListItem = ({id, img, name, description, breed}) => `
<li>
	<img src="${img}" alt="Black Cat">
	<h3>${name}</h3>
	<p><span>Breed: </span>${breed}</p>
	<p><span>Description: </span>${description}</p>
	<ul class="buttons">
		<li class="btn edit"><a href="/cats/edit/${id}">Change Info</a></li>
		<li class="btn delete"><a href="/cats/shelter/${id}">New Home</a></li>
	</ul>
</li>`;

function parseHomepageData(cats, data) {
	return data.toString().replace('{{cats}}', cats.join('\n'));
}



function homeHandler(req, res){
	const pathname = url.parse(req.url).pathname;
	if(pathname === '/' && req.method === 'GET'){
		fs.readFile(homepath, function(err, data){
			if(err) {
				console.log(err);
                res.writeHead(500, {
					'Content-Type': 'text/plain'
                });
				
                res.write('Something wrong happened')
                res.end();
                return;
			}
			
			const cats = JSON.parse(fs.readFileSync('/media/user/Data/Study/Softuni/JS-Web/catagram/data/cats.json').toString());
			console.log(cats)
			res.write(parseHomepageData(cats.map(makeCatListItem), data));
			res.end();

		})
	} else {
		return true;
	} 
}

module.exports = homeHandler;
