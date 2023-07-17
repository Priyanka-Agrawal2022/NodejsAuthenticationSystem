const express = require("express");
const router = express.Router();
const passport = require("passport");
const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);
router.get("/app", passport.checkAuthentication, homeController.app);
router.use("/users", require("./users"));

module.exports = router;
