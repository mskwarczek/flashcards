const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');

const DATABASEURL = require('./server/data/dburl.json');
const SECRETKEY = require('./server/data/secret_key.json');
const User = require('./server/schema/user');
const FlashcardsSet = require('./server/schema/flashcardsSet');
const server = express();

server.use(express.static(path.join(__dirname, 'build')));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoReconnect: true
});

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

// Check if user is logged in
const checkLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.sendStatus(401);
    }
    else {
        next();
    };
};

// /flashcards/
// Return all flashcards sets
server.get('/api/flashcards', (req, res, next) => {
    FlashcardsSet.find({}, 'name _id lang', (err, docs) => {
        if (err) {
            next(err);
        }
        else if (!docs) {
            next('No documents in database');
        }
        else {
            res.send(JSON.stringify(docs));
        };
    });
});

// Return flashcards set with given id
server.get('/api/flashcards/:id', (req, res, next) => {
    FlashcardsSet.findById(req.params.id, 'file', (err, docs) => {
        if (err) {
            next(err);
        }
        else if (!docs) {
            next('No documents in database');
        }
        else {
            res.sendFile(path.join(__dirname, `server/data/flashcards/${ docs.file }.json`));
        };
    });
});

server.post('/api/register', (req, res, next) => {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.repeatPassword) {
        res.redirect('/register?missingFields');
    }
    else if (req.body.password !== req.body.repeatPassword) {
        res.redirect('/register?badPassword');
    }
    else {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
                next(error);
            }
            else {
                let newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    activeFlashcardsSet: req.body.flashcardsSet,
                    flashcards: [],
                });
                newUser.save((error, user) => {
                    if (error && error.code === 11000) {
                        console.log(error);
                        res.redirect('/register?duplicateEmail');
                    }
                    else res.redirect('/');
                });
            };
        });
    };
});

server.post('/api/login', (req, res, next) => {
    if (!req.body.email || !req.body.password)
        res.sendStatus(401);
    else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    throw new Error('badEmail');
                }
                else {
                    bcrypt.compare(req.body.password, user.password, (error, result) => {
                        if (error) {
                            res.sendStatus(401);
                        }
                        else if (result) {
                            req.session.userId = user._id;
                            user = {
                                username: user.username,
                                email: user.email,
                                activeFlashcardsSet: user.activeFlashcardsSet,
                                flashcards: user.flashcards,
                                isLoggedIn: true
                            };
                            res.send(JSON.stringify(user));
                        }
                        else {
                            res.sendStatus(401);
                        };
                    });
                };
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(401);
            });
    };
});

server.put('/api/flashcardsUpdate', checkLogin, (req, res, next) => {
    User.updateOne({ _id: req.session.userId }, { flashcards: req.body.flashcards }, (error, result) => {
        if (error) {
            console.log(error);
            next(error);
        } else {
            res.send('"OK"');
        };
    });
});

server.put('/api/activeSetUpdate', checkLogin, (req, res, next) => {
    User.updateOne({ _id: req.session.userId }, { activeFlashcardsSet: req.body.activeFlashcardsSet }, (error, result) => {
        if (error) {
            console.log(error);
            next(error);
        } else {
            res.send('"OK"');
        };
    });
});

server.get('/api/user', checkLogin, (req, res) => {
    User.findOne({ _id: req.session.userId })
        .then(user => {
            if (!user) {
                throw new Error('noUserInDB');
            }
            else {
                user = {
                    username: user.username,
                    email: user.email,
                    activeFlashcardsSet: user.activeFlashcardsSet,
                    flashcards: user.flashcards,
                    isLoggedIn: true
                };
                res.send(JSON.stringify(user));
            };
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(401);
        });
});

server.post('/api/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.clearCookie('session_id');
            res.send('"OK"');
        };
    });
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);
