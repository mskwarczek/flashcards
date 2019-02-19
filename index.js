const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const server = express();

server.use(express.static(path.join(__dirname, 'build')));

server.use(bodyParser.json());

server.get('/api/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/data/user.json'));
});

server.put('/api/user', (req, res) => {
    let newData = JSON.stringify(req.body);
    fs.writeFile('src/data/user.json', newData, function(err) { //This would normally be a database modification rather than file update
        if (err) throw err;
    });
    res.send('OK');
});

server.get('/api/flashcards', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/data/flashcards.json'));
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);