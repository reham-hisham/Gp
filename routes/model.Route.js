const router = require("express").Router();
const auth = require('../middleware/auth')
const userController = require(".././controllers/user/profile.controller");
const multer = require("multer");
const postController = require('../controllers/model/model.controller')
const upload = multer({ dest: "images/" });
const oldposts = require('../models/oldJops.model')
const companyUserAuth = require('../middleware/companyUserAuth')

//router.post("/profile", userController.uploadProfileImage);
//////////////// user ////////////////////////////////////

module.exports = router;
