var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done, firstN, lastN, street, city, building, flat, phone) {
        req.checkBody('email', 'Nieprawidłowy adres e-mail').notEmpty().isEmail();
        req.checkBody('password', 'Hasło musi się składać z conajmniej 4 znaków').notEmpty().isLength({ min: 4 });
        req.checkBody('firstN', 'Twoje imię może zawierać do 20 liter').notEmpty().isLength({ min: 1, max: 20 }).isAlpha('pl-PL');
        req.checkBody('lastN', 'Twoje nazwisko może zawierać do 50 liter').notEmpty().isLength({ min: 1, max: 50 });
        req.checkBody('street', 'Nazwa twojej ulicy może zawierać do 40 znaków').notEmpty().isLength({ min: 1, max: 40 });
        req.checkBody('city', 'Nazwa twojego miasta może zawierać do 40 znaków').notEmpty().isLength({ min: 1, max: 40 });
        req.checkBody('building', 'Numer twojego budynku może zawierać do 4 znaków').notEmpty().isLength({ min: 1, max: 4 });
        req.checkBody('flat', 'Numer twojego mieszkania może zawierać do 4 znaków').isLength({ min: 1, max: 4 });
        req.checkBody('phone', 'Numer twojego telefonu komórkowego musi zawierać 9 cyfr').isMobilePhone('pl-PL');
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function(error) {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        User.findOne({ 'email': email }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, { message: 'Adres e-mail jest już w użyciu.' });
            }
            var newUser = new User();
            newUser.firstName = req.body.firstN;
            newUser.lastName = req.body.lastN;
            newUser.password = newUser.encryptPassword(req.body.password);
            newUser.email = req.body.email;
            newUser.street = req.body.street;
            newUser.city = req.body.city;
            newUser.buildingNumber = req.body.building;
            newUser.flatNumber = req.body.flat;
            newUser.phoneNumber = req.body.phone;
            console.log(newUser);

            newUser.save(function(err, result) {
                if (err) {
                    return console.log(err);
                }
                return done(null, newUser);
            });
        });
    }));
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Nieprawidłowy login lub hasło.').notEmpty().isEmail();
    req.checkBody('password', 'Nieprawidłowy login lub hasło.').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Nieprawidłowy login lub hasło.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Nieprawidłowy login lub hasło.' });
        }
        return done(null, user);
    });
}));