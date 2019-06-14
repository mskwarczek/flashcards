const mongoose = require('mongoose');

let FlashcardsSetSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    file: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lang: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    isReverse: {
        type: Boolean,
        required: false,
        default: false,
        unique: false
    },
    initialBoxSize: {
        type: Number,
        required: false,
        default: 15,
        min: 5,
        max: 30,
        unique: false
    },
    author: {
        type: String,
        required: true,
        unique: false,
        trim: true
    }
});

let FlashcardsSet = mongoose.model('FlashcardsSet', FlashcardsSetSchema);
module.exports = FlashcardsSet;
