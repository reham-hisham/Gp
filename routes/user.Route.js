const router = require("express").Router();
const auth = require('../middleware/auth')
const userController = require(".././controllers/user/profile.controller");
const multer = require("multer");
const postController = require('../controllers/company/post.controller')
const upload = multer({ dest: "images/" });
const oldposts = require('../models/oldJops.model')
const companyUserAuth = require('../middleware/companyUserAuth')
const notstrictauth = require('../middleware/notstrictauth')
//router.post("/profile", userController.uploadProfileImage);
//////////////// user ////////////////////////////////////
router.post("/register", userController.register); //Done
router.get("/account/:id", userController.viewAccount); //Done
router.post("/search", userController.search); //DONE

router.post("/login", userController.login); //DONE
router.post("/logout",auth, userController.logout);
router.get("/info",auth, userController.getUserData);//DONE
router.post("/deleteAccount", auth,userController.deleteSingleAcount);//DONE
router.post("/edit", auth,userController.edit); //DONE
router.post("/deleteProfileImage", auth,userController.deleteProfileImage); //DONE

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
  );//DONE
//////////// reset password///////////////
router.post("/sendOTP", userController.SendOTP);//DONE
router.post("/EnterOtp", userController.confiremOtp);//DONE
router.post("/resetPassword/:id",userController.ResetPassword);//DONE
router.post('/reaction/:id' , companyUserAuth , postController.addReaction)
router.get('/reactions/:id', postController.getAllReactions)
router.get('/comments/:id', postController.getComments)
router.post('/post' , companyUserAuth , postController.getUserPosts)
router.post('/comment/:id' , companyUserAuth , postController.addComment)
router.post('/follow/:id' , companyUserAuth , userController.ultimateFollow)
router.post("/companyPosts/:id" ,notstrictauth, postController.getCompanyPosts)
router.get('/country',  userController.getAllCountrisInWorld)
router.post('/city',  userController.getcities)

module.exports = router;
