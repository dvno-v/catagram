const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const formidable = require('formidable');
const url = require('url');

const addCatpath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/addCat.html';
const addBreedpath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/addBreed.html';
const shelterPath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/catShelter.html';
const editPath = '/media/user/Data/Study/Softuni/JS-Web/catagram/views/editCat.html';
const breedspath = '/media/user/Data/Study/Softuni/JS-Web/catagram/data/breeds.json';
const catspath = '/media/user/Data/Study/Softuni/JS-Web/catagram/data/cats.json';

function addCatHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    
    if(pathname == '/cats/add-cat' && req.method == 'GET') {
        fs.readFile(addCatpath, function(err, data){
			if(err) {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
                return;
            }
            
            let catBreedsPlaceholder = breeds.map(breed => `<option value="${breed}"> ${breed} </option>`)
            res.write(data.toString().replace('{{catBreeds}}', catBreedsPlaceholder.join('\n')));
            res.end();
		})
    }
    else if(pathname.startsWith('/cats/add-cat') && req.method == 'POST') {
        let form = new formidable.IncomingForm();

        form.parse (req, (err, fields, files) => {
            let oldpath = files.upload.path;
            let newpath = '/media/user/Data/Study/Softuni/JS-Web/catagram/content/images/' + files.upload.name;
            fs.readFile(oldpath,function (err1, data) {
                fs.writeFileSync(newpath, data);

                const newCat = {
                    id: (new Date()).getDate(),
                    name: fields.name, 
                    description: fields.description,
                    breed: fields.breed,
                    img: `/content/images/${files.upload.name}`
                }
                cats.push(newCat)
                fs.writeFile(catspath, JSON.stringify(cats), 'utf8', function (err2, data) {
                    if(err1 || err2) {
                        console.log(err1 || err2);
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        
                        res.write('Something wrong happened');

                        res.end();
                        return;
                    }
                    res.writeHead(301,
                        {Location: 'http://localhost:5000/'}
                    );
                    res.end();
                })
            });
        })    
    } else {
		return true;
    }
}

function addBreedHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    if(pathname == '/cats/add-breed' && req.method == 'GET') {
        fs.readFile(addBreedpath, function(err, data){
			if(err) {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
                return;
            }

            res.write(data);

            res.end();
		})
    } else if(pathname.startsWith('/cats/add-breed') && req.method == 'POST') {
            let body = ''

            req.on('data', function(data) {
                body += data;
            })

            
            req.on('end', () => {
                breeds.push(body.split('=')[1]);
                fs.writeFile(breedspath, JSON.stringify(breeds), 'utf8', function(err, data){
                    if(err) {
                        console.log(err);
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
        
                        res.write('Something wrong happened')
                        res.end();
                        return;
                    }
                    res.writeHead(301,
                        {Location: 'http://localhost:5000/'}
                    );
                    res.end();
                })
            })
        } else {
            return true;
        }   
}

function shelterCatHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    if(pathname.startsWith('/cats/shelter') && req.method == 'GET') {
        fs.readFile(shelterPath, function(err, data){
			if(err) {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
                return;
            }
            const foundCat = cats.find(e => e.id == pathname.split('/')[3]);
            Object.keys(foundCat).forEach(e => {
                data = data.toString().replace(`{{${e}}}`, foundCat[e])
            })
            res.write(data);
            res.end();
        })
    }else if (pathname.startsWith('/cats/shelter') && req.method == 'POST') {
        const filteredCats = cats.filter(e => e.id != pathname.split('/')[3]);

        fs.writeFile(catspath, JSON.stringify(filteredCats), 'utf8', function(err, data){
            if(err) {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
                return;
            }
            res.writeHead(301,
                {Location: 'http://localhost:5000/'}
            );
            res.end();
        })
    } else {
        return true;
    }
}

function editCatHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    
    let form = `<form class="cat-form" method="POST" enctype="multipart/form-data" id="edit-cat">
                    <h2>Edit Cat</h2>
                    <label for="name">Name</label>
                    <input type="text" name="name" id="name" value="{{name}}">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" >{{description}}</textarea>
                    <label for="group">Breed</label>
                    <label for="image">Image</label>
                    <input name="upload" type="file" id="image" name="upload">
                    <select id="group" name="breed">
                        <option value="Fluffy Cat">{{breed}}</option>
                    </select>
                    <button type="submit" form="edit-cat" >Edit Cat</button>
                </form>`;

    if(pathname.startsWith('/cats/edit') && req.method == 'GET') {
        fs.readFile(editPath, function(err, data){
			if(err) {
                console.log(err);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.write('Something wrong happened')
                res.end();
                return;
            }
            const foundCat = cats.find(e => e.id == pathname.split('/')[3]);
            Object.keys(foundCat).forEach(e => {
                form = form.replace(`{{${e}}}`, foundCat[e])
            })
            res.write(data.toString().replace('{{form}}', form));
            res.end();
		})
    }
    else if(pathname.startsWith('/cats/edit') && req.method == 'POST') {
        const form = new formidable.IncomingForm();

        form.parse (req, (err, fields, files) => {
            let oldpath = files.upload.path;
            let newpath = '/media/user/Data/Study/Softuni/JS-Web/catagram/content/images/' + files.upload.name;
            fs.readFile(oldpath,function (err1, data) {
                fs.writeFileSync(newpath, data);
                const foundCat = cats.find(e => e.id == pathname.split('/')[3]);

                foundCat.name = fields.name, 
                foundCat.description =  fields.description,
                foundCat.breed = fields.breed,
                foundCat.img = files.upload ? `/content/images/${files.upload.name}` : foundCat.img 

                fs.writeFile(catspath, JSON.stringify(cats), 'utf8', function (err2, data) {
                    if(err1 || err2) {
                        console.log(err1 || err2);
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        
                        res.write('Something wrong happened');

                        res.end();
                        return;
                    }
                    res.writeHead(301,
                        {Location: 'http://localhost:5000/'}
                    );
                    res.end();
                })
            });
        })    
    } else {
		return true;
    }
}

module.exports = [addCatHandler, addBreedHandler, shelterCatHandler, editCatHandler];