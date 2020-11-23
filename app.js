
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SEG = require('./routes/SEG');
var editpc = require('./routes/editpc');

var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
var methodOverride = require('method-override');

const User = require('./model/user');
const Post4selves = require('./model/post4selves');
const Commento = require('./model/comment');
mongoose.connect('mongodb+srv://junearza:love22na@cluster0-xs4ye.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connect server..'))
  .catch(err => console.log('cannot'));
middleware = require('./middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(require('express-session')({
  secret: 'member',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(process.env.PORT || 3000 || 5000, function (req, res) { })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
// app.use('/',require('./routes/index'))
app.use('/users', usersRouter);
app.use('/users/editpost', editpc);
app.use('/search', SEG);

app.get('/', function (req, res) { res.render('index'); })

app.get('/donate', middleware.isLoggedIn, function (req, res) { res.render('donate'); })
app.get('/contact', middleware.isLoggedIn, function (req, res) { res.render('contact'); })
app.get('/hospital', middleware.isLoggedIn, function (req, res) { res.render('hospital'); })
app.get('/covid19', middleware.isLoggedIn, function (req, res) { res.render('covid19'); })
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/edit', function (req, res) { res.render('edit'); })

app.post('/edit', function (req, res) {
  User.update({ _id: req.body.id }, {
    $set: {
      name: req.body.name,
      image: req.body.image
    }
  }, function (err, success) {
    if (err) { res.send(err) }
    else {
      console.log("condition else is working");
      Post4selves.updateMany({ id: req.body.id }, {
        $set: {
          name: req.body.name,
          userpic: req.body.image
        }
      }, function (error, success) {
        if (error) { console.log(123); }
        else {
          Commento.updateMany({ author_id: req.user._id }, {
            $set: {
              author: req.body.name,
              author_image: req.body.image
            }
          }, function (error, success) {
            if (error) { console.log(123); }
            else {
              console.log(Commento.name);
              console.log(req.body.id);
            }
          });
        }
      });
      res.redirect('users/home');
    }
  })
})

module.exports = app;