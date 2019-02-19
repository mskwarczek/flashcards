const express = require('express');
const path = require('path');

const server = express();

server.use(express.static(path.join(__dirname, 'build')));

server.get('/api/flashcards', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/data/flashcards.json'));
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);