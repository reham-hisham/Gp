const router = require("express").Router();

const userController = require(".././controllers/user/profile.controller");

const oldposts = require('../models/oldJops.model')
//router.post("/profile", userController.uploadProfileImage);
//////////////// user ////////////////////////////////////
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/info", userController.getUserData);
router.post("/deleteAccount", userController.deleteSingleAcount);
router.post("/edit", userController.edit);

//////////// reset password///////////////
router.post("/sendOTP", userController.SendOTP);
router.post("/EnterOtp", userController.confiremOtp);
router.post("/resetPassword/:id", userController.ResetPassword);


module.exports = router;
