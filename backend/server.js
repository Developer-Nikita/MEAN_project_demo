/* eslint-disable no-case-declarations */
const app = require("./app");
const debug = require("debug");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const config = require("./config/config");

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
console.log("-----------------");

const connectionString = 'mongodb://localhost:27017/nikitatask';

mongoose.set("strictQuery", false);
// mongoose.connect(connectionString, options);
console.log("connectionString==>", connectionString)
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

// Connected handler
mongoose.connection.on("connected", function () {
  console.log("Connected to DB using chain: " + config.database.dbName);
});

// Error handler
mongoose.connection.on("error", function (err) {
  console.log("MongoDB Error: ", err);
});

// Reconnect when closed
mongoose.connection.on("disconnected", function (err) {
  console.log("MongoDB Error disconnected: ", err);
  //self.connectToDatabase();
});
