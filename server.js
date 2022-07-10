if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()

const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('express-flash');

app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}))

app.use(passport.session())
app.use(flash())

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const loginRouter = require('./routes/login')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser({limit: '50mb', extended: false}))
app.use(methodOverride('_method'))



app.delete('/logout', function (req, res){
    req.session.destroy(function (err) {
      res.redirect('/'); 
    });
  });
  


  
const mongoose = require('mongoose');
const { response } = require('express')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/login', loginRouter)

app.listen(process.env.PORT || 3000)