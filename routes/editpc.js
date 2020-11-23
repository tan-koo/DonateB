
var express = require('express');
const router = express.Router();
var methodOverride = require('method-override');
const User = require('../model/user');
const Post4selves = require('../model/post4selves');
const Commento = require('../model/comment');
const middleware = require('../middleware');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

//post 
router.get("/:id", middleware.isLoggedIn, function (req, res) {
  console.log(req.params.id);
  Post4selves.findById(req.params.id, function (err, found) {
    if (err) { console.log(err) }
    else {
      console.log(found);
      res.render("editpost", { post4selves: found });
    }
  });
});

router.put("/:id", function (req, res) {
  Post4selves.findByIdAndUpdate(req.params.id, req.body.post4selves, function (err, update) {
    if (err) { console.log(err) }
    else {
      Commento.findByIdAndUpdate(req.params.id, req.body.comment, function (err, updateto) {
        if (err) { console.log(err) }
        else {
          console.log("456");
          res.redirect('/users/public');
        }
      });
    }
  });
});

// comment
router.get("/editcomment/:id", function (req, res) {
  Commento.findById(req.params.id, function (err, find) {
    if (err) { console.log(err) }
    else { res.render("editcomment", { comment: find }); }
  });
});

module.exports = router;