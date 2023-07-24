'use strict';
const mongoose = require('mongoose');

const LicensePayment = require('../../../models/LicensePayment'),
  Transaction = require('../../../models/Transaction'),
  UserSubscriptions = require('../../../models/UserSubscriptions'),
  config = require('../../../config/config');

const stripe = require('stripe')(config.stripe.SECRET_KEY);


// const stripe = require('stripe')('sk_test_51JeemBIW8ybZWNBgD0rkSNfBnyCHvS2TvTjRQiTR8OIqR7yJv8pvWn7E6RarUfnJdXueoQUX2JZNf0XGh7Z5Peoj006HN8tIc6');

exports.paymentIntent = async (id) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(id)
  console.log("paymentIntent hit");

  return paymentIntent;
}

exports.findPayment = (transactionId) => {
  console.log("findPayment hit");
  return LicensePayment.findOne({ "charges.data.payment_intent": transactionId });
}

// for credit purchase
exports.findCreditPayment = (transactionId) => {
  console.log("findCreditPayment hit");
  return Transaction.findOne({ "charges.data.payment_intent": transactionId });
}

exports.creditPaymentIntent = async (id) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(id)
  console.log("creditPaymentIntent hit");
  return paymentIntent;
}

// for annual user subscription purchase
exports.findUserSubscription = (transactionId) => {
  console.log("findCreditPayment hit");
  return UserSubscriptions.findOne({ "charges.data.payment_intent": transactionId });
}

exports.UserSubscriptionPaymentIntent = async (id) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(id)
  console.log("creditPaymentIntent hit");
  return paymentIntent;
}

