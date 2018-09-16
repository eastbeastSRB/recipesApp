const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({
      email: email
    })
    .then(user => {
      // Chek if User Match
      if(!user){
        return done(null, false, {message: 'No user found'});
      }

      // Check matching password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;

        if(isMatch){
          return done(null, user);
        }else{
          return done(null, false, {message: 'Password Incorrect'});
        }
      })

    })
    .catch(err => {
      console.log(err);
    });

  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
