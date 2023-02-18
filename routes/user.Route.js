const router = require("express").Router();
const auth = require('../middleware/auth')
const userController = require(".././controllers/user/profile.controller");
const multer = require("multer");

const upload = multer({ dest: "images/" });
const oldposts = require('../models/oldJops.model')
//router.post("/profile", userController.uploadProfileImage);
//////////////// user ////////////////////////////////////
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout",auth, userController.logout);
router.get("/info",auth, userController.getUserData);
router.post("/deleteAccount", auth,userController.deleteSingleAcount);
router.post("/edit", auth,userController.edit);
// add image 
router.post(
    "/userImage",
    auth,
    upload.single("userImage"),
  
    userController.addImage
  );
// cv
router.post(
    "/userCV",
    auth,
    upload.single("userCV"),
  
    userController.addCV
  );
//////////// reset password///////////////
router.post("/sendOTP", userController.SendOTP);
router.post("/EnterOtp", userController.confiremOtp);
router.post("/resetPassword/:id",userController.ResetPassword);


module.exports = router;
