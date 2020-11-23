
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) { res.render('index'); });

router.get('/login', function (req, res, next) { res.render('login'); })

router.get('/register', function (req, res, next) { res.render('register') })

router.get('/donate', function (req, res, next) { res.render('donate') })

router.get('/public', function (req, res, next) { res.render('public') })

router.get('/contact', function (req, res, next) { res.render('contact') })

router.get('/home', function (req, res, next) { res.render('home') })

router.get('/hospital', function (req, res, next) { res.render('hospital') })

router.get('/webinfor', function (req, res, next) { res.render('webinfor') })

router.get('/covid19', function (req, res, next) { res.render('covid19') })

router.get('/index1', function (req, res, next) { res.render('index1') })

module.exports = router;