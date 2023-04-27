const router = require('express').Router()
const post = require('../models/jopPost.model')
const notstrictauth = require('../middleware/notstrictauth')

const multer = require("multer");
const upload = multer({ dest: "images/" });
const jopPostController = require('../controllers/company/jobpost.controller')
const CompanyPostController = require('../controllers/company/post.controller')
const companyProfileController = require('../controllers/company/profile.controller')
const companyAuth = require('../middleware/company')
router.post("/registration",companyProfileController.register)
router.post('/confirmation',companyProfileController.confiremOtp )
router.post('/login',companyProfileController.login)
router.post("/post",companyAuth,upload.single("postImage"), CompanyPostController.create);
router.post("/logout",companyAuth, companyProfileController.logout);
router.get("/profile", companyAuth , companyProfileController.getCompanyData)
router.get("/company/:id" ,notstrictauth, companyProfileController.getCompanyDataById)

router.post(
    "/companyImage",
    companyAuth,
    upload.single("companyImage"),
  
    companyProfileController.uploadProfileImage
  );
  router.post('/edit' , companyAuth , companyProfileController.edit)
  router.delete('/delete/post/:id', companyAuth , CompanyPostController.deletePost)
router.post('/jobpost', companyAuth , jopPostController.create)
router.delete('/delete/jobpost/:id', companyAuth , jopPostController.deleteJobPost)



 module.exports = router