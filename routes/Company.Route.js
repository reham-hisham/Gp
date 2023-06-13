const router = require("express").Router();
const post = require("../models/jopPost.model");
const notstrictauth = require("../middleware/notstrictauth");
const companyUserAuth = require("../middleware/companyUserAuth");
const multer = require("multer");
const upload = multer({ dest: "images/" });
const imagecontroller = require("../controllers/common/image.controller");
const jopPostController = require("../controllers/company/jobpost.controller");
const CompanyPostController = require("../controllers/company/post.controller");
const companyProfileController = require("../controllers/company/profile.controller");
const offer = require("../controllers/jobOffer/offer");
const companyAuth = require("../middleware/company");
router.post("/registration", companyProfileController.register);
router.post("/confirmation", companyProfileController.confiremOtp);
router.post("/login", companyProfileController.login);
router.post(
  "/companyImage",
  companyAuth,
  upload.single("companyImage"),

  companyProfileController.uploadProfileImage
);
router.post("/edit", companyAuth, companyProfileController.edit);
router.delete(
  "/delete/post/:id",
  companyAuth,
  CompanyPostController.deletePost
);
router.post("/jobpost", companyAuth, jopPostController.create);
router.delete(
  "/delete/jobpost/:id",
  companyAuth,
  jopPostController.deleteJobPost
);
router.post(
  "/follow/:id",
  companyUserAuth,
  companyProfileController.ultimateFollowForcompanies
);
router.get("/alljobpost", companyAuth, jopPostController.getAllJobPosts);
router.get("/onjobpost/:id", companyAuth, jopPostController.getOneJobPosts);
router.post("/sendJoboffer", companyAuth, offer.sendOffer);

router.post("/edit", companyAuth, companyProfileController.edit);
router.delete(
  "/delete/post/:id",
  companyAuth,
  CompanyPostController.deletePost
);
router.post("/jobpost", companyAuth, jopPostController.create);
router.delete(
  "/delete/jobpost/:id",
  companyAuth,
  jopPostController.deleteJobPost
);
router.post(
  "/follow/:id",
  companyUserAuth,
  companyProfileController.ultimateFollowForcompanies
);
router.get("company/:id" , companyUserAuth , companyProfileController.getCompanyDataById)
router.get("/alljobpost", companyAuth, jopPostController.getAllJobPosts);
router.get("/onjobpost/:id", companyAuth, jopPostController.getOneJobPosts);
router.post("/sendJoboffer", companyAuth, offer.sendOffer);
router.delete("/deleteJobOffer/:id", companyAuth, offer.deleteOffer);
router.get("/showMyoffers",companyAuth,offer.viewMyJobOffers)
module.exports = router;
