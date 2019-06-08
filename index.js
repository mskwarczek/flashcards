const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const DATABASEURL = require('./server/data/dburl.json');
const SECRETKEY = require('./server/data/secret_key.json');
const User = require('./server/schema/user');
const server = express();

server.use(express.static(path.join(__dirname, 'build')));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(session({
    name: 'session_id',
    resave: false,
    saveUninitialized: false,
    secret: SECRETKEY,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 4,
        sameSite: true
    }
}));

server.get('/api/userStatus', (req, res) => {
    if (!req.session.userId) {
        res.json("FAILURE");
    }
    else {
        res.json("SUCCESS");
    };
});

server.get('/api/flashcards', (req, res) => {
    res.sendFile(path.join(__dirname, 'server/data/flashcards.json'));
});

server.post('/api/register', (req, res) => {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.repeatPassword) {
        res.redirect('/register?missingFields');
    }
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
            password: req.body.password,
            flashcards: []
        });
        newUser.save((err, user) => {
            if (err && err.code === 11000) {
                res.redirect('/register?duplicateEmail');
            }
            else res.redirect('/');
        });
    };
});

server.post('/api/login', (req, res) => {
    if (!req.body.email || !req.body.password)
        res.sendStatus(403);
    else {
        mongoose.connect(DATABASEURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoReconnect: true
        });
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    throw new Error('badEmail');
                }
                else if (user.password === req.body.password) {
                    user = {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        flashcards: user.flashcards
                    };
                    req.session.userId = user.id;
                    res.send(JSON.stringify(user));
                }
                else {
                    throw new Error('badPassword');
                }
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(403);
            });
    };
});

server.put('/api/updateUser', (req, res) => {
    mongoose.connect(DATABASEURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        autoReconnect: true
    });
    User.updateOne({ email: req.body.email }, { flashcards: req.body.flashcards }, (error, result) => {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            res.end();
        };
    });
});

server.post('/api/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.send(error);
        } else {
            res.clearCookie('session_id');
        };
    });
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);
