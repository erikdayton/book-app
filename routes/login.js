const express = require('express')
const localStrategy = require('passport-local')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/users')

passport.use(new localStrategy({ usernameField: 'email' },(email, password, done) => {
  User.findOne({ email: email})
    .then(user => {
      if (!user) {
        return done(null, false, {message: 'Email not registered '})
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;

        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'password incorect'})
        }
      })
    })
    .catch(err => console.log(err))
  }),

);
passport.serializeUser(function(user, done) {
  done(null, user);
}),

passport.deserializeUser(function(user, done) {
  done(null, user);
})

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('logins/login')
})

router.get('/index', (req, res) => {
  res.render('logins/index')
})

router.post('/login', (req, res, next) => {
  next()
}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}), (err, req,res,next) => {
  console.log(err)
})


router.get('/register', async (req, res) => {
  res.render('logins/register')
})
router.post('/register', async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10)
  const user = await new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed
  })
    try {
      const newUser = await user.save()
      res.redirect('/login')
    } catch (err) {
      res.redirect('/register', {
      errorMessage: 'Error Creating Account'
      })
    }
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next( )
}



// app.delete('/logout', function (req, res, next) {
//   req.logOut(function(err) {
//     if (err) {
//       return next(err)
//     }
//     res.redirect('/login')
//   })
// })


module.exports = router
