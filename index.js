const http = require('http');
const port = 5000;

const app = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })
    res.write('Hello world!')
    res.end();
})

console.log(`Server started on port ${port} https://localhost:5000/`)

app.listen(port);