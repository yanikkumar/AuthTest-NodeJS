var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');

// store the user._id in session
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// fetch the user id from database server
passport.deserializeUser(function (id, done) {
    done(err, user);
});



// Sign In

passport.use("local-login", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true     // passback the entire request to callback  
}, function (req, email, password, done) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        if (!user.comparePassword(password)) {
            return done(null, false);
        }

        return done(null, user);
    });

}));