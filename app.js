var express = require('express');

require('dotenv').config();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
const hbs = require('express-handlebars');
var expressValidator = require('express-validator');

// Authentication packages
var session = require('express-session');
var passport = require('passport');
var MySQLStore = require('express-mysql-session')(session);
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');


//routes
var databaseAPI = require('./databaseAPI');
var router = require('./routes/router');

var app = express();


app.engine('hbs', hbs({
    extname: 'hbs',
    partialsDir: [
        //  path to your partials
        __dirname + '/views',
        __dirname + '/views/partials'
    ]
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'assets', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());

var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};
var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'foobar',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
    //cookie: {secure: true}
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(require('less-middleware')(path.join(__dirname, 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/views', express.static(path.join(__dirname, 'views')));

app.use('/api/databaseAPI', databaseAPI);
app.use(router);

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log(username);
        console.log(password);
        const db = require('./db');
        db.query('SELECT id, password FROM users WHERE username = ?', [username], function (err, results, fields) {
            if (err) {
                done(err)
            }
            if (results.length === 0) {
                done(null, false);
                console.log('User not found');
            } else {
                console.log('User found');

                const hash = results[0].password.toString();

                bcrypt.compare(password, hash, function (err, response) {
                    if (response) {
                        console.log('successful login');
                        return done(null, results[0].id);
                    } else {
                        console.log('incorrect password');
                        return done(null, false);
                    }
                });
            }
        });
    }
));

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : err;

    // render the error page
    console.log('IN ERROR MESSAGE');
    console.log(err.message);
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;