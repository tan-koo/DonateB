
const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Post4selves = require('../model/post4selves');
const Commento = require('../model/comment');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
const middleware = require('../middleware');

/* GET users listing. */
router.get('/', function (req, res) { res.send(''); });

router.get('/login', function (req, res) { res.render('login'); })

router.get('/register', function (req, res) { res.render('register'); })

router.post('/register', function (req, res) {
  const { username, password, confirm, email } = req.body;
  let errors = [];
  var today = new Date();
  var members = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

  if (!username || !email || !password || !confirm) {
    errors.push({ msg: 'Please enter all fields' });
    console.log(1);
  }

  else if (password != confirm) {
    errors.push({ msg: 'Passwords do not match' });
    console.log(2);
  }

  else if (errors.length > 0) {
    res.render('register', { errors, username, password, confirm, email });
  }

  else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.redirect('register', { errors, username, password, confirm, email });
      }
      else {
        User.register(new User({
          username: req.body.username, password: req.body.password,
          confirm: req.body.confirm, email: req.body.email, permission: "member"
        }), req.body.password, function (err, user) {
          if (err) {
            console.log(err);
            return res.render('register');
          }
          passport.authenticate('local')(req, res, function () {
            res.render('login', { runs: undefined, success: true, successs: true, error: err });
          })
        })
      }
    })
  }
})

router.post('/login', passport.authenticate('local', {
  successRedirect: 'public',
  failureRedirect: 'login'
}), function (req, res) { });

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/public', middleware.isLoggedIn, function (req, res) {
  Post4selves.find({}, function (error, post4selves) {
    if (error) { console.log(error); }
    else {
      Commento.find({}, function (error, comment) {
        if (error) { console.log(error); }
        else {
          User.find({ name: 't1' }, function (err, user) {
            if (err) { console.log(err) }
            else {
              console.log("------------------------------------------------");
              console.log(user);
              res.render('public', { Post4selves: post4selves, Commento: comment, User: user })
            }
          })
        }
      });
    }
  });
})

router.get('/home', middleware.isLoggedIn, function (req, res) {
  var name = req.query.name;
  Post4selves.find({}, function (error, post4selves) {
    if (error) { console.log(error); }
    else {
      User.find({}, function (err, User) {
        Commento.find({}, function (err, comment) {
          if (err) { console.log(err) }
          else { res.render('home', { Post4selves: post4selves, Commento: comment }) }
        })
      })
    }
  })
})

router.post("/home", function (req, res) {
  var today = new Date();
  var dates = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  console.log(dates);
  Post4selves.create(new Post4selves({
    name: req.user.name, date: dates, image: req.body.image, id: req.user.id, text: req.body.text,
    Post_by: req.body.id, userpic: req.user.image, number_like: 0, tag: req.body.tag
  }), function (error, newpost) {
    if (error) { console.log(error); }
    else {
      console.log("post is successed");
      res.redirect("back");
    }
  })
})

router.post("/public", function (req, res) {
  var today = new Date();
  var dates = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = new Date();
  var times = time.getHours() + ':' + time.getMinutes();
  Commento.create(new Commento({
    text: req.body.comment, date: dates, time: times, author: req.user.name,
    author_image: req.user.image, author_id: req.user.id, post: req.body.post
  }), function (error, newpost) {
    if (error) { console.log(error); }
    else {
      console.log("comment is successed");
      res.redirect('back');
    }
  })
})

router.get("/:id/profile", middleware.isLoggedIn, function (req, res) {
  Post4selves.findById(req.params.id, function (err, found) {
    if (err) { console.log(err) }
    else {
      Post4selves.find({}, function (error, post4selves) {
        if (error) { console.log(error); }
        else {
          Commento.find({}, function (err, comment) {
            if (err) { console.log(err) }
            else {
              User.find({}, function (err, user) {
                if (err) { console.log(error); }
                else {
                  const target_id = req.params.id;
                  console.log(user);
                  res.render('profile', { Post4selves: post4selves, Commento: comment, User: user, target_id: target_id })
                }
              })
            }
          })
        }
      })
    }
  });
});

router.delete("/:id", function (req, res) {
  Post4selves.findByIdAndRemove(req.params.id, function (err, del) {
    if (err) { console.log(err) }
    else {
      Commento.findByIdAndRemove(req.params.id, function (err, det) {
        if (err) { console.log(err) }
        else { res.redirect('back'); }
      })
    }
  })
});

router.get('/donate', middleware.isLoggedIn, function (req, res) { res.render('donate'); })

router.get('/contact', middleware.isLoggedIn, function (req, res) { res.render('contact'); })

router.get('/hospital', middleware.isLoggedIn, function (req, res) { res.render('hospital'); })

router.get('/covid19', middleware.isLoggedIn, function (req, res) { res.render('covid19'); })

router.get('/edit', function (req, res) { res.render('edit'); })

router.put("/:id", function (req, res) {
  Post4selves.findById(req.params.id, function (err, finished) {
    if (err) { console.log(err) }
    else {
      Post4selves.findOne({ _id: req.params.id, like: req.body.uid }, function (err, F) {
        if (F == null) {
          console.log(finished);
          finished.like.push(req.body.uid);
          finished.number_like++;
          finished.save();
          console.log(finished.number_like);
          res.redirect('back');
        }
        else {
          finished.like.remove(req.body.uid);
          finished.number_like--;
          finished.save();
          console.log(finished.number_like);
          res.redirect('back');
        }
      })
    }
  });
});

module.exports = router;