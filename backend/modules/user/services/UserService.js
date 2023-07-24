'use strict';

const mongoose = require('mongoose');

const User = require('../../../models/User');
const Note = require('../../../models/Note');

exports.createUser = (data) => {
  const { name, email, mobile, password, type } = data;
  console.log("data==>",data)
  const user = new User({
    name: name,
    email: email,
    mobile: mobile,
    password: password,
    type: type
  });

  console.log("user==>",user);
  return user.save();
}

exports.findByEmailOrMobile = (data) => {
  const { email, mobile } = data;
  const emailMobileQuery = {};
  if (email || mobile) {
    if (email) {
      emailMobileQuery.email = email.toLowerCase();
    } else {
      emailMobileQuery.mobile = mobile;
    }
    return User.findOne(emailMobileQuery, 'name email mobile password type');
  } else return null;
}

exports.findByID = (id) => {
  return User.findById(id);
}

exports.findByIDWithPassword = (id) => {
  return User.findById(id, 'password');
}

exports.findUserByEmail = async (email) => {
  const data = await User.findOne({email:email});
  console.log("data==>", data);
  return data;
}
exports.findUserNotes = async (query) => {
  console.log("query==>",query);
  let page = query.page ? Number(query.page) : 1,
      limit = query.limit ? Number(query.limit) : 10  // keeping default limit 10
    console.log("page==>", page, "limit==>", limit)
  let searchQuery = {};
  if(query.userId && Object.keys(query.userId).length){
    searchQuery = {createdBy:mongoose.Types.ObjectId(query.userId)}
  }
  const notes= await Note.find(searchQuery).limit(limit)
  .skip((page - 1) * limit);
  console.log("notes==>",notes);
  return notes;
}

exports.addNote = async (payload) => {
  const notes= await Note.create({...payload});
  console.log("notes==>",notes);
  return notes;
}

exports.editNote = async (payload) => {
  console.log("payload==>",payload);
  const updateQry = {
    title: payload.title,
    content: payload.content
  }
  const notes= await Note.findOneAndUpdate({_id: payload._id, createdBy: payload.createdBy}, updateQry,{new:true} );
  console.log("notes==>",notes);
  return notes;
}

exports.findNoteById = async (id) => {
  const notes= await Note.findById(id);
  console.log("notes==>",notes);
  return notes;
}

exports.deleteNote = async (payload) => {
  let searchQuery = {};
  if(payload.createdBy && Object.keys(payload.createdBy).length){
    searchQuery = {_id: mongoose.Types.ObjectId(payload.id), createdBy:mongoose.Types.ObjectId(payload.createdBy)}
  }
  return Note.findOneAndDelete(searchQuery);
}