
const mongoose = require('mongoose');
// passportLocalMongoose = require('passport-local-mongoose');

let commentSchema = new mongoose.Schema({
        text: String,
        date: String,
        time: String,
        author: String,
        author_image: String,
        author_id: String,
        post: String
});

// tarotSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Commento', commentSchema);