const queue = require("../config/kue");
const forgotPasswordMailer = require("../mailers/forgot_password_mailer");

queue.process("emails", function (job, done) {
  console.log("emails worker is processing a job", job.data);

  // calling forgotPassword function from forgot password mailer
  forgotPasswordMailer.forgotPassword(
    job.data.name,
    job.data.email,
    job.data.token
  );

  done();
});
