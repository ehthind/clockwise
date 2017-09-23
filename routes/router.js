var util = require('util')
var express = require('express');
var router = express.Router();
var path = require('path');
var expressValidator = require('express-validator');
var passport = require('passport');
var bcrypt = require('bcrypt');
const saltRounds = 10;

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log('in Auth middleware');
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.render('auth')
    };
}

/* GET home page. */
router.get('/main', authenticationMiddleware(), function (req, res, next) {
    res.render('index');
});

/* GET auth page. */
router.get('/', function (req, res, next) {
    res.render('../assets/landing/views/index.hbs');
});

/* GET auth page. */
router.get('/auth', authenticationMiddleware(), function (req, res, next) {
    res.render('index');
});

router.get('/login', function (req, res, next) {
    res.redirect('auth');
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth',
        failureFlash: true
    })
);

router.get('/logout', function (req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('auth');
});

router.get('/start', function (req, res, next) {
    res.render('start');
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
        } else { // start insert into db
            const username = req.body.username;
            const password = req.body.password;
            const email = req.body.email;

            const db = require('../db.js');
            var query = 'INSERT INTO users (username, password, email) VALUES (?,?,?)';

            //hash our password
            bcrypt.hash(password, saltRounds, function (err, hash) {
                // run query on db. 
                db.query(query, [username, hash, email], function (error, results, fields) {
                    if (error) {
                        console.error(error);
                        res.render('auth', {
                            regErr: "Account was unable to be created"
                        });
                        return;
                    } else {
                        db.query('SELECT LAST_INSERT_ID() as user_id', function (error, results, fields) {
                            if (error) throw error;

                            const user_id = results[0];
                            console.log(user_id);

                            req.login(user_id, function (err) {
                                res.redirect('/');
                            });
                        });
                    }
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