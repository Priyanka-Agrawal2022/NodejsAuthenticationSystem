// setup middleware to pass flash messages from controller to ejs template
module.exports.setFlash = function (req, res, next) {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };

  next();
};
