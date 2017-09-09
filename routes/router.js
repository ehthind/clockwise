var util = require('util')
var express = require('express');
var router = express.Router();
var path = require('path');
var expressValidator = require('express-validator');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* GET auth page. */
router.get('/auth', function (req, res, next) {
    res.render('auth');
});

// register a user
router.post('/register', function (req, res, next) {

    //data validation.
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 5-100 characters long.').len(5, 100);
    req.checkBody('repeat_password', 'Password must be between 5-100 characters long.').len(5, 100);
    req.checkBody('repeat_password', 'Passwords do not match, please try again.').equals(req.body.password);

    req.getValidationResult().then(function (result) {
        // if errors in data
        if (!result.isEmpty()) {
            console.error('errors:', util.inspect(result.array()));
            res.render('auth', {
                regErr: "Account was unable to be created"
            });
            return;
        } else { // else insert into database
            const username = req.body.username;
            const password = req.body.password;
            const repeat_password = req.body.passwordMatch;
            const email = req.body.email;

            const db = require('../db.js');

            var query = 'INSERT INTO users (username, password, email) VALUES (?,?,?)';
            db.query(query, [username, password, email], function (error, results, fields) {
                if (error) {
                    console.error(error);
                    return;
                }

                res.render('auth', {
                    regSuc: 'Account created! Now login'
                });
            });
        }
    });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
});

module.exports = router;