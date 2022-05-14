const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  division:{
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  access:{
    type: Boolean
  },
  TagID:{
    type: String
  }
  
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
