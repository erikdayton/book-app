const mongoose = require('mongoose')
// const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
})

// // userSchema.plugin(uniqueValidator, {message: 'is already taken'})

module.exports = mongoose.model('User', userSchema)
