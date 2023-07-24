'use strict';
const mongoose = require('mongoose');

const License = require('../../../models/License'),
  ApplicationLicense = require('../../../models/ApplicationLicense'),
  MedicalLicense = require('../../../models/MedicalLicense'),
  VisaLicense = require('../../../models/VisaLicense'),
  LicensePayment = require('../../../models/LicensePayment'),
  Lookup = require('../../../models/Lookup');
const CommonService = require('../../../services/CommonService');

// for creating licenseID on license module
exports.createLicense = (data) => {
  const { } = data;

  const licenseId = new License({
    ...data
  })

  return licenseId.save();
}
// for creating application Id on license module
exports.createApplicationLicense = (data) => {
  const { } = data;
  let applicationForm = {};
  console.log("data in createApplicationLicense==>", data);
  if (data.renewApp) {
    delete data._doc._id
    applicationForm = new ApplicationLicense({
      ...data._doc
    })
  }
  if (!data.renewApp) {
    applicationForm = new ApplicationLicense({
      ...data
    })
  }
  console.log("applicationForm==>", applicationForm);
  return applicationForm.save();
}

// for editing licenseId details on license module
exports.updateLicense = (licenseData) => {
  console.log("updateLicense on service==>", licenseData);
  delete licenseData._id;
  return License.findOneAndUpdate({ _id: licenseData.licenseId }, { ...licenseData }, { new: true });
}

// for editing applicationId details on license module
exports.updateApplicationLicense = (applicationData) => {
  console.log("updateApplicationLicense on service==>", applicationData);
  return ApplicationLicense.findByIdAndUpdate({ _id: applicationData._id }, { ...applicationData }, { new: true });
}

exports.generateLoginData = (data) => {
  console.log("generateLoginData==>", data);
  return {
    data
  };
}

// for edit and fetch licenseID detials on license module
exports.findByID = (licenseId) => {
  // console.log("findByID hit");
  // console.log("licenseId==>", licenseId);
  return License.findById(licenseId);
}

// for creating medicalId on license module
exports.createMedicalLicense = (data) => {
  let medicalform = {};
  console.log("data in createMedicalLicense==>", data);
  if (data.renewApp) {
    delete data._doc._id
  }
  medicalform = new MedicalLicense({
    ...data
  })
  console.log("medicalform==>", medicalform);
  return medicalform.save();
}

// for editing medicalId details on license module
exports.updateMedicalLicense = (medicalData) => {
  console.log("updateMedicalLicense on service==>", medicalData);
  console.log("medicalData._id==>", mongoose.Types.ObjectId(medicalData._id));
  return MedicalLicense.findOneAndUpdate({ _id: medicalData._id }, { ...medicalData }, { new: true });
}

// for creating visId on license module
exports.createVisaLicense = (data) => {
  const { } = data;
  let visaform = {};
  console.log("data in visaform==>", data);
  if (data.renewApp) {
    delete data._doc._id
    visaform = new VisaLicense({
      ...data._doc
    })
  }
  if (!data.renewApp) {
    visaform = new VisaLicense({
      ...data
    })
  }

  console.log("visaform==>", visaform);

  return visaform.save();
}

// for editing medicalId details on license module
exports.updateVisaLicense = (visaData) => {
  console.log("updateVisaLicense on service==>", visaData);
  console.log("visaData._id==>", mongoose.Types.ObjectId(visaData._id));
  return VisaLicense.findOneAndUpdate({ _id: visaData._id }, { ...visaData }, { new: true });
}

// for fetch application license detials on license module
exports.findByIDAppLicense = (id) => {
  console.log("ApplicationLicense findbyID hit");
  console.log("id==>", id);
  return ApplicationLicense.findById(id);
}

// for fetch Medical license detials on license module
exports.findMedicalLicense = (id) => {
  console.log("MedicalLicense findbyID hit");
  console.log("id==>", id);
  return MedicalLicense.findById(id);
}

// for fetch Visa license detials on license module
exports.findVisaLicense = (id) => {
  console.log("findVisaLicense findbyID hit");
  console.log("id==>", id);
  return VisaLicense.findById(id);
}

// for add license payment on license module
// exports.createLicensePayment = (data) => {
//   console.log("data before==>",data);

//   const paymentDetails = new LicensePayment({
//     ...data

//   })
//   console.log("data after==>",data);

//   return paymentDetails.save();
// }


exports.getLicenseDetails = (payload) => {
  console.log("payload==>", payload);
  const { userId } = payload;

  return License.aggregate([{
    $match: {
      createdBy: mongoose.Types.ObjectId(userId)
    }
  }, {
    $lookup: {
      from: 'applicationlicenses',
      localField: '_id',
      foreignField: 'licenseId',
      as: 'applicationlicenses'
    }
  }, {
    $lookup: {
      from: 'visalicenses',
      localField: '_id',
      foreignField: 'licenseId',
      as: 'visalicenses'
    }
  }, {
    $lookup: {
      from: 'medicallicenses',
      localField: '_id',
      foreignField: 'licenseId',
      as: 'medicallicenses'
    }
  }, {
    $unwind: {
      path: "$applicationlicenses",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $unwind: {
      path: "$visalicenses",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $unwind: {
      path: "$medicallicenses",
      preserveNullAndEmptyArrays: true
    }
  }]);
}

exports.commonLicenseCount = () => {
  return License.find().count();
}

// for send email to user about license status
exports.sendLicenseStatusEmail = (data) => {
  console.log("data in sendLicenseStatusEmail==>", data);

  var locals = {
    name: data.name,
    email: data.email,
    licenseType: data.licenseType,
    emailSubject: `'${data.licenseType} License Renewal Status Update'`
    // emailSubject: licenseType
  }
  // console.log("locals==>", locals);
  return CommonService.sendEmail(locals, 'license-renewal');
}

exports.getLicenseType = (payload) => {
  const { query } = payload;
  return Lookup.findOne(query);
}