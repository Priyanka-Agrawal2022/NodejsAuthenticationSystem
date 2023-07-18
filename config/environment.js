// const fs = require("fs");
// const rfs = require("rotating-file-stream");
// const path = require("path");

// const logDirectory = path.join(__dirname, "../production_logs");
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// const accessLogStream = rfs.createStream("access.log", {
//   interval: "1d",
//   path: logDirectory,
// });

const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "blah",
  db: "nodejs_auth_dev",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEJS_AUTH_GMAIL_USERNAME,
      pass: process.env.NODEJS_AUTH_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.NODEJS_AUTH_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.NODEJS_AUTH_GOOGLE_CLIENT_SECRET,
  google_callback_url: "http://localhost:8000/users/auth/google/callback",
  // morgan: {
  //   mode: "dev",
  //   options: { stream: accessLogStream },
  // },
  redis_url: process.env.NODEJS_AUTH_REDIS_URL,
  mongodb_atlas_uri: process.env.NODEJS_AUTH_MONGODB_ATLAS_URI,
  mongodb_atlas_username: process.env.NODEJS_AUTH_MONGODB_ATLAS_USERNAME,
  mongodb_atlas_password: process.env.NODEJS_AUTH_MONGODB_ATLAS_PASSWORD,
};

const production = {
  name: process.env.NODEJS_AUTH_ENVIRONMENT,
  asset_path: process.env.NODEJS_AUTH_ASSET_PATH,
  session_cookie_key: process.env.NODEJS_AUTH_SESSION_COOKIE_KEY,
  db: process.env.NODEJS_AUTH_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEJS_AUTH_GMAIL_USERNAME,
      pass: process.env.NODEJS_AUTH_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.NODEJS_AUTH_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.NODEJS_AUTH_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.NODEJS_AUTH_GOOGLE_CALLBACK_URL,
  // morgan: {
  //   mode: "combined",
  //   options: { stream: accessLogStream },
  // },
  redis_url: process.env.NODEJS_AUTH_REDIS_URL,
  mongodb_atlas_uri: process.env.NODEJS_AUTH_MONGODB_ATLAS_URI,
  mongodb_atlas_usernname: process.env.NODEJS_AUTH_MONGODB_ATLAS_USERNAME,
  mongodb_atlas_password: process.env.NODEJS_AUTH_MONGODB_ATLAS_PASSWORD,
};

module.exports =
  eval(process.env.NODEJS_AUTH_ENVIRONMENT) == undefined
    ? development
    : eval(process.env.NODEJS_AUTH_ENVIRONMENT);
