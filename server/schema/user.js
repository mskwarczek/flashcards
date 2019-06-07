const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    flashcards: {
        type: Array,
        required: true
    }
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
