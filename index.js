const http = require('http');
const handlers = require('./handlers/handlers');
const port = 5000;

const app = http.createServer((req, res) => {
    for (const handler in handlers) {
        if(handlers[handler](req, res)) {
            break;
        }
    }
});

console.log(`Server started on port ${port} https://localhost:5000/`)

app.listen(port);