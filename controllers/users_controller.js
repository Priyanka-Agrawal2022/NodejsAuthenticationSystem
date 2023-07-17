const User = require("../models/user");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const queue = require("../config/kue");
const forgotPasswordMailerWorker = require("../workers/forgot_password_mailer_worker");

// sign up controller
module.exports.signUp = async (req, res) => {
  // redirect user to web app if the user is logged in
  if (req.isAuthenticated()) {
    return res.redirect("/app");
  }

  // render sign up view to user if the user is not logged in
  return res.render("user_sign_up", {
    title: "Sign Up",
  });
};

// sign in controller
module.exports.signIn = async (req, res) => {
  // redirect user to web app if the user is logged in
  if (req.isAuthenticated()) {
    return res.redirect("/app");
  }

  // render sign in view to user if the user is not logged in
  return res.render("user_sign_in", {
    title: "Sign In",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      console.log("Passwords do not match!");
      req.flash("error", "Passwords do not match!");
      return res.redirect("back");
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const signUpData = req.body;

      // extracting password from sign up data
      const { password } = signUpData;

      // generating hash of password
      const hash = bcryptjs.hashSync(password, 12);

      signUpData.password = hash;

      // creating the user
      await User.create(signUpData);

      req.flash(
        "success",
        "You have successfully signed up, sign in to continue!"
      );
      return res.redirect("/users/sign-in");
    } else {
      console.log("You have signed up, login to continue!");
      req.flash("success", "You have already signed up, sign in to continue!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error: ", err);
    req.flash("error", err);
    return;
  }
};

//sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash("success", "Signed in successfully!");
  return res.redirect("/app");
};

// sign out the user
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error in signing out the user!", err);
    }

    req.flash("success", "You haved signed out!");
    return res.redirect("/");
  });
};

// render forgot password view
module.exports.forgotPassword = async function (req, res) {
  return res.render("user_forgot_password", {
    title: "Forgot Password",
  });
};

// generate a temporary access token & send an email to user with reset password link
module.exports.generateAccessToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (user) {
      const tempPassword = crypto.randomBytes(20).toString("hex");

      await User.updateOne({ email: email }, { $set: { token: tempPassword } });

      // forgotPasswordMailer.forgotPassword(user.name, email, tempPassword);

      // create a job to send to the queue for forgot password email
      let job = queue
        .create("emails", {
          name: user.name,
          email,
          token: tempPassword,
        })
        .priority("critical")
        .save(function (err) {
          if (err) {
            console.log("Error in sending to the queue:", err);
            return;
          }

          console.log("job enqueued", job.id);
        });

      req.flash("success", "Please check your inbox to reset your password!");
      return res.redirect("back");
    } else {
      console.log("User not found!");
      req.flash("error", "User not found!");
      // return res.status(200).send('User not found!');
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error", err);
    req.flash("error", "An error occurred!");
    return res.status(400).send(err);
  }
};

// find the user based on access token & render reset password view
module.exports.verifyAccessToken = async (req, res) => {
  try {
    const token = req.query.token;
    let user = await User.findOne({ token: token });

    if (user) {
      return res.render("user_reset_password", {
        title: "Reset Password",
        user: user,
      });
    } else {
      req.flash("error", "Link expired!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error:", err);
    req.flash("error", "An error occurred!");
    return res.status(400).send(err);
  }
};

// reset the user's password & update in db
module.exports.resetPassword = async (req, res) => {
  try {
    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }

    const password = req.body.password;
    const hash = bcryptjs.hashSync(password, 12);
    const token = req.query.token;

    const user = await User.findOne({ token: token });

    await User.updateOne(
      { _id: user._id },
      { $set: { password: hash, token: "" } },
      { new: true }
    );

    console.log("Password has been reset!");
    req.flash("success", "Password has been reset!");
    return res.redirect("/users/sign-in");
  } catch (err) {
    console.log("Error:", err);
    req.flash("error", "An error occurred!");
    return res.status(400).send(err);
  }
};
