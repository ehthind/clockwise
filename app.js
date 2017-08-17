var express = require('express');

require('dotenv').config();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('handlebars');
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

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());
app.use(cookieParser());

var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};
var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'keyboard cat',
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
                console.log('login failed');
                return;
            }
            console.log('User found');

            const hash = results[0].password.toString();

            bcrypt.compare(password, hash, function (err, response) {
                if (response === true) {
                    console.log('successful login');
                    return done(null, result[0].id);
                } else {
                    console.log('incorrect password');
                    return done(null, false);
                }
            });
        });
    }
));

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
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;