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
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    activeFlashcardsSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashcardsSet',
        required: true,
        unique: false
    },
    flashcards: {
        type: Array,
        required: true,
        unique: false
    }
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
