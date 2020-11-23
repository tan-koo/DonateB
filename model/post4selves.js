
User = require('./user');
var mongoose = require("mongoose");
var objectId = require('mongodb').ObjectID;

var post4selfSchema = new mongoose.Schema({
   Post_by: String,
   userpic: String,
   name: String,
   date: String,
   image: String,
   id: String,
   text: String,
   like: [ String ],
   number_like: Number,
   tag: String
});

module.exports = mongoose.model("Post4selves", post4selfSchema);