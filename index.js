const express = require("express");
const port = 8000;
const app = express();
const env = require("./config/environment");
require("./config/view_helpers")(app);
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// set up static files
app.use(express.static("./assets"));

app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// parse incoming req object into string
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

//set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "doooit",
    // TODO change the secret before deployment in production mode
    secret: "blah",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

// use passport for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// use connect-flash
app.use(flash());

// use middleware to pass flash messages from controller to ejs template
app.use(customMware.setFlash);

// use express router
app.use(require("./routes/index"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error: ${err}`);
    return;
  }

  console.log(`Server is running on port: ${port}`);
});
