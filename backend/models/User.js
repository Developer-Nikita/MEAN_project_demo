'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 6
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number
  },
  password: {
    type: String,
    minLength: 6
  },
  type: {
    type: String,
    enum: ['ADMIN', 'USER']
  }
}, {
  timestamps: true,
  typecast: true
});

module.exports = mongoose.model("User", UserSchema, "users");