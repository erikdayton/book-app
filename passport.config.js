const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./models/users')
const passport = require('passport')

module.exports = function(passport) {
  passport.use (
    new localStrategy((email, password, done) => {
      console.log('test')
      User.findOne({ email: email})
        .then(user => {
          console.log(user)
          if (!user) {
            return done(null, false, {message: 'That Email is not registered'})
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {message: 'password  isincorect'})
            }
          })
        })
        .catch(err => console.log(err))
    })
  );
  passport.serializeUser((user, done) => { done(null, user.id)})
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    })
  })
}
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));


// function initialize(passport, getUserByEmail, getUserById) {
//   const authenticateUser = async (email, password, done) => {
//     const user = await getUserByEmail(email)
//     console.log('user: ' + user)

//     if (user == null) {
//       return done(null, false, {message: 'no user found with that email' })
//     }
//     try {

//       console.log('password is: ' + password)
//       console.log('user.password is: ' + user.password)

//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user)
//       } else {
//         return done(null, false, {message: 'Incorrect Password'})
//       }
//     } catch (e) {
//       return done(e)
//     }
//   }
//   passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
//   passport.serializeUser((user, done) => done(null, user.id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//    })
// module.exports = initialize

// }
