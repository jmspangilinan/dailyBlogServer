const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

 
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },

  isAdmin: {
    type: Boolean,
    default: true
  },


});


module.exports = mongoose.model('User', userSchema);


