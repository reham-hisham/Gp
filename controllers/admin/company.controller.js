const CompanyModel = require("../../models/company.model");
const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");
const userModel = require("../../models/users.model")
const otp = require("../../helper/sendOTP");
const sendEmail = require("../../helper/sendEmail");
const oldposts = require("../../models/oldJops.model");
const jopPost = require("../../models/jopPost.model");
const Image = require('../common/image.controller')
class company{
  static getUnconfermedCompanies = async (req, res) => {
try {
      let companies = await CompanyModel.find({confirmed:false})
    res.send(companies)
} catch (error) {
    res.status(400).send({
        error:error.message
    })
}} 
 static confirmCompany = async (req, res) => {
    try {
          let company = await CompanyModel.findById(req.params.id)
          company.confirmed = !company.confirmed
        await company.save()
        res.send(company)
    } catch (error) {
        res.status(400).send({
            error:error.message
        })
    }
  
  };

 static blockCompany = async (req, res) => {
    try {
          let company = await CompanyModel.findById(req.params.id)
          company.isBlocked = (!company.isBlocked)
        await company.save()
        res.send(company)
    } catch (error) {
        res.status(400).send({
            error:error.message
        })
    }
  
  };
  static blockUser= async(req,res)=>{
    try {
        let user = await userModel.findById(req.params.id)
        user.isBlocked = (!user.isBlocked)
      await user.save()
      res.send(user)
  } catch (error) {
      res.status(400).send({
          error:error.message
      })
  }

  }

}
module.exports = company;
