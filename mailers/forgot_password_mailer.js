const nodemailer = require("../config/nodemailer");
const env = require("../config/environment");

// function to send an email to user with forgot password ejs template containing the reset password link
exports.forgotPassword = (name, email, token) => {
  console.log("inside forgotPassword mailer");

  let htmlString = nodemailer.renderTemplate(
    {
      name: name,
      email: email,
      token: token,
    },
    "/forgot_password_template.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: email,
      subject: "Reset Your Password",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      console.log("Message sent", info);
      return;
    }
  );
};
