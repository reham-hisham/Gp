const CompanyModel = require("../../models/company.model");
const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");
const companyFollowModel=require('../../models/companiesFollowCompanies')
const otp = require("../../helper/sendOTP");
const sendEmail = require("../../helper/sendEmail");
const oldposts = require("../../models/oldJops.model");
const followModel = require("../../models/followCompanies");
const Image = require('../common/image.controller')
class company extends Image{
  static register = async (req, res) => {
    try {
      const CompanyData = new CompanyModel(req.body);

      CompanyData.OTP = -1;

      await CompanyData.save();
      await sendEmail({
        userEmail: req.body.email,
        subject: "conferm your company details ",
        contant: ` Plaese send us any doc that conferm u are a real company `,
      });
      await this.SendOTP(req, res);
      res.status(200).send();
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "error adding user",
      });
    }
  };
  static SendOTP = async (req, res) => {
    try {
      let user = await CompanyModel.findOne({ email: req.body.email });
      if (user) {
        let Otp = otp(6);
        console.log(user);
        await sendEmail({
          userEmail: req.body.email,
          subject: "Reset Your Password",
          contant: ` Plaese enter this ${Otp} to reset your password`,
        });
        user.OTP = Otp;
        await user.save();
        return res.send({ email: req.body.email, id: user._id });
      } else {
        throw new Error("user not fount in server");
      }
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }
  };

  static confiremOtp = async (req, res) => {
    try {
      let user = await CompanyModel.findOne({ email: req.body.email });
      if (!user) {
        throw new Error("companty not found email not found");
      }
      if (req.body.OTP == user.OTP) {
        user.OTP = 0;
        user.save();
        res.send({ id: user._id });
      } else {
        throw new Error("Otp not valid ");
      }
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }
  };
  static login = async (req, res) => {
    try {
      const userData = await CompanyModel.login(
        req.body.email,
        req.body.password
      );
      if (userData.isBlocked) {
        throw new Error("Blocked ");
      }
      const token = await userData.generateToken();
      if (userData.OTP == null || userData.OTP == -1) {
        console.log(userData.OTP);
        throw new Error("please validate your account first");
      }
      
      res.status(200).send({ userObject: {
        id: userData._id,
        token: token,
        name: userData.name,
        email: userData.email
      }});
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "failed",
      });
    }
  };

  static uploadProfileImage = async (req, res) => {
   this.uploadImage(req, res);
  };
static deleteProfileImage = async (req , res)=>{
  this.deleteImage(req, res)
}
  static getCompanyData = async (req, res) => {
    res.send({
      apiStatus: true,
      data: {
        name: req.user.name,
        number: req.user.number,
        email: req.user.email,
        about: req.user.about,
        country: req.user.country,
        image: req.user.image,
        address: req.user.address,
        city: req.user.city,
        numberOfemployee: req.user.numberOfemployee,
        industry :req.user.industry

      },
      message: "data featched",
    });
  };
  static getCompanyDataById = async (req, res) => {
    const company = await CompanyModel.findById(req.params.id)
let isFollowed = false
let userRole=req.user.collection.name
    if(req.user&&userRole=='companies'){
      let follow = await companyFollowModel.findOne({followerId: req.user._id})
      console.log(follow.companyId);
      follow.companyId.forEach((e)=>{
        
        if(e.toString() == company._id.toString()){
          isFollowed = true
        }
      })
    }
    else if(req.user&&userRole=='users'){
      console.log(userRole);
      let follow = await followModel.findOne({followerId: req.user._id})
      console.log(follow.companyId);
      follow.companyId.forEach((e)=>{
        
        if(e.toString() == company._id.toString()){
          isFollowed = true
        }
      })

    }
    res.send({
      apiStatus: true,
      data: {
        name: company.name,
        address : company.address,
        number: company.number,
        email: company.email,
        about: company.about,
        country: company.country,
        image: company.image,
        city: company.city,
        numberOfemployee: company.numberOfemployee,
        industry :company.industry,
        isFollowed :isFollowed
      }
    });
  };
  static logout = async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((tok) => req.token != tok.token);
      await req.user.save();
      res.send("logged out");
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "failed loggout ",
      });
    }
  };

  static deleteSingleAcount = async (req, res) => {
    try {
      const user = await CompanyModel.deleteOne({ id: req.params.id });
      res.send("Account Deleted");
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "error deleting user",
      });
    }
  };
  static edit = async (req, res) => {
    try {
      //recrypt the password again
      if (req.body.password) {
        throw new Error("canpt rest password from here");
      }
    
      if(req.user.email == req.body.email){
        
        delete req.body.email
      }
      
       const userUpdated = await CompanyModel.updateOne(
        { id: req.user._id },
        req.body,
        { upsert: false, runValidators: true }
      );
      
      res.send({
        apiStatus: true,
        data: userUpdated,
        message: "updates",
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static ResetPassword = async (req, res) => {
    try {
      let user = await CompanyModel.findOne({ _id: req.params.id });
      if (user.OTP != 0) {
        throw new Error("user should enter otp ");
      }

      user.password = req.body.password;
      user.OTP = -1;
      user.save();
      res.send();
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }
  };
  static ultimateFollowForcompanies = async (req,res)=>{
    const userId = req.user._id;
    const compId = req.params.id;
    let isFollowed=false

    try {
      let followObject = await companyFollowModel.findOne({followerId:userId});
      if(!followObject){
        followObject=await companyFollowModel.create({followerId:userId,companyId:compId})
        isFollowed=true;
      }else if(followObject){
        let isFound =false
        followObject.companyId.forEach((e)=>{
          if(e.toString() == compId.toString()){
            console.log("we erach here")
            isFound = true
          }
        })
        
        if (!isFound){ followObject.companyId.push(compId);
        isFollowed=true
        }
        else
        {  let companies = []
          followObject.companyId.forEach(element => {
            if(element.toString() != compId.toString()){
              companies.push(element)
              
            }
          });
          followObject.companyId = companies}
      }
      await followObject.save();


      res.send({ followObject,isFollowed });
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding follow",
      });
    }
  }
}
module.exports = company;
