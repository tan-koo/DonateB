
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) { res.render('index'); });

router.get('/login', function (req, res, next) { res.render('login'); })

router.get('/register', function (req, res, next) { res.render('register') })

router.get('/public', function (req, res, next) { res.render('public') })

router.get('/home', function (req, res, next) { res.render('home') })

router.get('/hospital', function (req, res, next) { res.render('hospital') })

router.get('/index1', function (req, res, next) { res.render('index1') })

module.exports = router;