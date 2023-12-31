const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_controller");
const passport = require("passport");

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);
router.post("/create", usersController.create);

// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/destroy-session", usersController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/forgot-password", usersController.forgotPassword);
router.post("/generate-access-token", usersController.generateAccessToken);
router.get("/verify-access-token", usersController.verifyAccessToken);
router.post("/reset-password", usersController.resetPassword);

module.exports = router;
