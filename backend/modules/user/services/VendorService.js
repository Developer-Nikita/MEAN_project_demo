'use strict';

const Vendor = require('../../../models/Vendor'),
  VendorProduct = require('../../../models/VendorProduct'),
  VendorRestaurant = require('../../../models/VendorRestaurant'),
  CoworkingSpace = require('../../../models/CoworkingSpace'),
  VendorRetailer = require('../../../models/VendorRetailer'),
  MeetingRoom = require('../../../models/MeetingRoom');

const config = require('../../../config/config');

const stripe = require('stripe')(config.stripe.SECRET_KEY);


exports.findByID = (id) => {
  console.log("id in service==>", id);
  return Vendor.findById(id);
}

// find cafe
exports.findByVendorIdSingleCafe = (vendorId) => {
  console.log("vendorId==>", vendorId);
  return CoworkingSpace.findOne({ vendorId: vendorId });
}

// find Restaurant
exports.findByVendorIdSingleRestaurant = (vendorId) => {
  console.log("vendorId==>", vendorId);
  return VendorRestaurant.findOne({ vendorId: vendorId });
}

// find Retailer
exports.findByVendorIdSingleRetail = (vendorId) => {
  console.log("vendorId==>", vendorId);
  return VendorRetailer.findOne({ vendorId: vendorId });
}

// find product list
exports.findByIdProducts = (vendorDetailsId) => {
  console.log("vendorDetailsId==>", vendorDetailsId);
  return VendorProduct.find({ vendorDetailsId: vendorDetailsId });
}

exports.findCafe = (payload) => {
  const { query, populate } = payload;
  const populatedItems = populate ? populate : [{ path: 'spaceType' }, { path: 'facilities' }];
  return CoworkingSpace.findOne(query).populate(populatedItems);
}

exports.findRestaurant = (payload) => {
  const { query, populate } = payload;
  const populatedItems = populate ? populate : [{ path: 'spaceType' }, { path: 'facilities' }];
  return VendorRestaurant.findOne(query).populate(populatedItems);
}

exports.findReatailer = (payload) => {
  const { query } = payload;
  return VendorRetailer.findOne(query).populate([{ path: 'spaceType' }, { path: 'shopCategory' }, { path: 'facilities' }]);
}


// find Meeting Rooms
exports.findMeetingRooms = (vendorTypeId) => {
  return MeetingRoom.find({ vendorTypeId: vendorTypeId });
}

exports.updateCoworkingSpace = (payload) => {
  const { query, data } = payload;
  return CoworkingSpace.updateOne(query, data, { new: true });
}

exports.updateMeetingRoom = (payload) => {
  const { query, data } = payload;
  return VendorRestaurant.updateOne(query, data, { new: true });
}