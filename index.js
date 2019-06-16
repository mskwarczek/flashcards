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
        return res.sendStatus(401);
    };
    return next();
};

// /flashcards/
// Return all flashcards sets
server.get('/api/flashcards', (req, res, next) => {
    FlashcardsSet.find({}, 'name _id lang', (err, docs) => {
        if (err) {
            return next(new Error(err));
        }
        else if (!docs) {
            return next(new Error('No documents in database'));
        };
        return res.send(JSON.stringify(docs));
    });
});

// Return flashcards set with given id
server.get('/api/flashcards/:id', (req, res, next) => {
    FlashcardsSet.findById(req.params.id, 'file', (err, docs) => {
        if (err) {
            return next(new Error(err));
        }
        else if (!docs) {
            return next(new Error('No documents in database'));
        };
        return res.sendFile(path.join(__dirname, `server/data/flashcards/${ docs.file }.json`));
    });
});

// /user/
// Get current user data
server.get('/api/user', checkLogin, (req, res) => {
    User.findOne({ _id: req.session.userId })
        .populate('activeFlashcardsSet')
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
                return res.send(JSON.stringify(user));
            };
        })
        .catch(error => {
            console.log(error);
            return res.sendStatus(401);
        });
});

// Register new user
server.post('/api/user/register', (req, res, next) => {
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.repeatPassword) {
        return res.redirect('/register?missingFields');
    }
    else if (req.body.password !== req.body.repeatPassword) {
        return res.redirect('/register?badPassword');
    };
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return next(new Error(err));
        };
        let newUser = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash,
            activeFlashcardsSet: req.body.flashcardsSet,
            flashcards: []
        });
        newUser.save((err, user) => {
            if (err && err.code === 11000) {
                return res.redirect('/register?duplicateEmail');
            };
            return res.redirect('/');
        });
    });
});

// Login user and start new session
server.post('/api/login', (req, res, next) => {
    if (!req.body.email || !req.body.password)
        return res.sendStatus(401);
    else {
        User.findOne({ email: req.body.email })
            .populate('activeFlashcardsSet')
            .then(user => {
                if (!user) {
                    throw new Error('badEmail');
                };
                return user;
            })
            .then(user => {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error || !result) {
                        res.sendStatus(401);
                    } else {
                        req.session.userId = user._id;
                        user = {
                            username: user.username,
                            email: user.email,
                            activeFlashcardsSet: user.activeFlashcardsSet,
                            flashcards: user.flashcards,
                            isLoggedIn: true
                        };
                        return res.send(JSON.stringify(user));
                    };
                });
            })
            .catch(error => {
                console.log(error);
                return res.sendStatus(401);
            }); 
    };
});

// Update user data (activeFlashcardsSet, flashcards)
server.put('/api/user/update', checkLogin, (req, res, next) => {
    User.updateOne({ _id: req.session.userId }, {
        activeFlashcardsSet: req.body.activeFlashcardsSet,
        flashcards: req.body.flashcards
    }, { omitUndefined: true }, (error, result) => {
        if (error) {
            return next(new Error(error));
        };
        return res.send('"OK"');
    });
});

// Logout user and close session
server.post('/api/user/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(new Error (error));
        } else {
            res.clearCookie('session_id');
            return res.send('"OK"');
        };
    });
});

server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server is listening on port ${port}`);
