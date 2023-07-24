const mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    maxLength: 100,
    minLength: 3
  },
  content: {
    type: String,
    default: '',
    maxLength: 1000,
    minLength: 5
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fileAttachment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  typecast: true
});

module.exports = mongoose.model("Note", noteSchema, "notes");