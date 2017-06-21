var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var mongoStore = require('connect-mongo')(session);
var Handlebars = require('handlebars');
var helmet = require('helmet');
var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

var app = express();

// database connection
mongoose.connect('mongodb://user:user@ds135089.mlab.com:35089/mlab_database');


require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');


//Middleware setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection }), // save session to database using curent db connection
    cookie: { maxAge: 180 * 60 * 1000 } // time (ms) after session will be deleted from database
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session; // pass session to views
    next();
});
app.use(helmet());
//Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/', routes);

// catch and render 404 page 
app.use(function(req, res, next) {
    res.status(404).render('404', {
        title: "Strona nie istnieje",
        user: req.user
    });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
