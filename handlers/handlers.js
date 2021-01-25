const staticFileHandler = require('./static-files');
const homeHandler = require('./home');
const catsHandlers = require('./cat');

module.exports = [
    homeHandler,
    staticFileHandler, 
    ...catsHandlers,
]