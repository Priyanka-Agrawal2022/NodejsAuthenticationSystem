const mongoose = require("mongoose");

const env = require("../config/environment");

// mongoose.connect(`mongodb://0.0.0.0/${env.db}`);

mongoose.connect(
  "mongodb+srv://prnkgrwl286:2MOOHXxgoD1Ni9n0@cluster0.zecaxjp.mongodb.net/nodejs_auth_prod"
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to db!"));

db.once("open", function () {
  console.log("Successfully connected to database: MongoDB");
});

module.exports = db;
