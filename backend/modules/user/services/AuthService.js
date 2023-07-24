'use strict';


const jwt = require('jsonwebtoken');

const config = require('../../../config/config');

exports.createUserAccessToken = (userTokenData) => {
  return jwt.sign(userTokenData, config.JWT.JWT_SECRET, {
    expiresIn: config.JWT.JWT_SECRET_VALIDITY
  });
}

exports.generateOtpToken = (tokenData) => {
  return jwt.sign(tokenData, config.JWT.JWT_SECRET, {
    expiresIn: config.FORGOT_PASSWORD.TOKEN_VALIDITY
  });
}

exports.decodeOtpToken = (passwordToken) => {
  return jwt.verify(passwordToken, config.JWT.JWT_SECRET);
}

exports.sendRegistrationEmail = (data, otp) => {
  var locals = {
    email: data.email,
    name: data.name,
    emailSubject: "Register Success",
    otp
  }
  return CommonService.sendEmail(locals, 'user-registration');
}

exports.decodeMobValidateString = async (mobValidateString) => {
  console.log("mobValidateString==>", mobValidateString);
}