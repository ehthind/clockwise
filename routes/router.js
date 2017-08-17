var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET auth page. */
router.get('/auth', function(req, res, next) {
    res.render('auth');
});

module.exports = router;
