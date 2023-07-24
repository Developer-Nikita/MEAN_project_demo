'use strict';
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AuthService = require('../services/AuthService'),
  UserService = require('../services/UserService');

exports.signUp = async (req, res) => {
  try {
    let saveResult;
    console.log("req.body==>",req.body);
    if (!req.body.email) { throw 'Email is Required'; }
    const user = await UserService.findByEmailOrMobile(req.body);
    if (user) {
      if (user.mobile.toString() !== req.body.mobile.toString()) {
        throw 'Email Alredy Register With Diff Mobile';
      } else {
        throw 'Already Register';
      }
    } else {
      saveResult = await UserService.createUser({...req.body});
      console.log("saveResult==>",saveResult);
    }

    return res.send({
      success: true,
      data: saveResult,
      message: 'Register Success'
    });
  } catch (err) {
    console.log("err==>",err.message);
    return res.status(500).json({ success: false, message: err.message? err.message : err });
  }
}

exports.login = async function (req, res) {
  try {
    console.log("req.body==>", req.body);
    if (req.body.email && req.body.password) {
      const data = await UserService.findUserByEmail(req.body.email);
      if (!data) throw new Error("User not exists.");
      if(data.password === req.body.password){
        let {
          _id, type, email, name
        } = data;
        
        let details = {
          _id, type, email, name
        }
  
        const token = jwt.sign({ _id, type, email, name }, 'Nikita_Secret');
        return res.json({ success: true, token: token, data: details });
      }else{
        res.send({
          success: false,
          msg:"Password does not match!"
        })
        // throw new Error("Password does not match!");
      }
    } else {
      throw new Error("Please enter Email or password.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.fetchNote = async function (req, res) {
    try {
        let searchQry = {};
        let page = req.query.page ? Number(req.query.page) : 1,
        limit = req.query.limit ? Number(req.query.limit) : 10
        searchQry.page = page;
        searchQry.limit = limit;
      if (req.user.email && req.user._id) {
        const data = await UserService.findUserByEmail(req.user.email);
        if (!data) throw new Error("User not exists.");
        if(req.user.type === "USER"){
            searchQry.userId = req.user._id;
        }
        const Note = await UserService.findUserNotes(searchQry);
        return res.json({ success: true, data: Note });
  
      } else {
        res.status(404).json({ success: false, msg: 'Please enter Email or _id.' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };

  exports.addNote = async function (req, res) {
    try {
      if (req.user.email && req.user._id) {
        const createdBy = req.user._id;
        const data = await UserService.findUserByEmail(req.user.email);
        if (!data) throw new Error("User not exists.");
        const Note = await UserService.addNote({...req.body,createdBy});
        return res.json({ success: true, data: Note, msg: "Data added successfully" });
  
      } else {
        throw new Error("Please enter Email or _id.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };

  exports.editNote = async function (req, res) {
    try {
      if(req.body._id){
        if (req.user.email && req.user._id) {
          const createdBy = req.user._id;
          const data = await UserService.findUserByEmail(req.user.email);
          if (!data) throw new Error("User not exists.");
          req.body ={
            ...req.body,
            createdBy
          }
          const Note = await UserService.editNote(req.body);
          return res.json({ success: true, data: Note, msg: "Data updated successfully" });
    
        } else {
          res.status(404).json({ success: false, msg: 'User email not found!' });
        }
      }else{
        res.status(404).json({ success: false, msg: '_id is required to update the data' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };

  exports.getNote = async function (req, res) {
    try {
      console.log("req.param==>",req.params.id);
      if(req.params.id){
        if (req.user.email && req.user._id) {
          // const data = await UserService.findUserByEmail(req.user.email);
          // if (!data) throw new Error("User not exists.");
          const Note = await UserService.findNoteById(req.params.id);
          return res.json({ success: true, data: Note, msg: 'Data fetched successfully!' });
    
        } else {
          throw new Error("Please enter Email or _id.");
        }
      }else{
        res.status(404).json({ success: false, msg: 'Id not found!' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };

  exports.deleteNote = async function (req, res) {
    try {
      if(req.body._id){
        let searchQry = {};
        if (req.user.email && req.user._id) {
          const createdBy = req.user._id;
          const data = await UserService.findUserByEmail(req.user.email);
          if (!data) throw new Error("User not exists.");

          if(req.user.type === "USER"){
            searchQry = req.user._id;
        }
        const id =req.body._id;
          const Note = await UserService.deleteNote({searchQry, id });
          return res.json({ success: true, msg: "Data deleted successfully" });
    
        } else {
          res.status(404).json({ success: false, msg: 'User email not found!' });
        }
      }else{
        res.status(404).json({ success: false, msg: 'id is required to update the data' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: error.message });
    }
  };