const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');

const DATABASEURL = require('./server/data/dburl.json');
const User = require('./server/schema/user');
const server = express();

server.use(express.static(path.join(__dirname, 'build')));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get('/api/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'server/data/user.json'));
});

server.put('/api/user', (req, res) => {
    let newData = JSON.stringify(req.body);
    fs.writeFile('server/data/user.json', newData, function (err) { //This would normally be a database modification rather than file update
        if (err) throw err;
    });
    res.send('OK');
});

server.get('/api/flashcards', (req, res) => {
    res.sendFile(path.join(__dirname, 'server/data/flashcards.json'));
});

server.post('/api/login', (req, res) => {

    if (!req.body.email || !req.body.password)
        res.redirect('/?missingFields');

    else {
        mongoose.connect(DATABASEURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoReconnect: true
        });

        User.findOne({ email: req.body.email }, function (err, user) {
            if (user.get('password') === req.body.password) {
                res.send(JSON.stringify(user));
            }
        });
    }
});

server.post('/api/register', (req, res) => {

    if (!req.body.email || !req.body.username || !req.body.password || !req.body.repeatPassword)
        res.redirect('/register?missingFields');

    else if (req.body.password !== req.body.repeatPassword) {
        res.redirect('/register?badPassword');
    }
    
    else {
        mongoose.connect(DATABASEURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoReconnect: true
        });

        let newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err, user) {
            if (err.code === 11000) {
                res.redirect('/register?duplicateEmail');
            }
            else res.redirect('/');
        });
    }
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);