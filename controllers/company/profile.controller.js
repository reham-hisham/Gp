const CompanyModel = require("../../models/company.model");
const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");

const otp = require("../../helper/sendOTP");
const sendEmail = require("../../helper/sendEmail");
const oldposts = require("../../models/oldJops.model");
const jopPost = require("../../models/jopPost.model");

class company {
  static register = async (req, res) => {
    try {
      const CompanyData = new CompanyModel(req.body);

      CompanyData.OTP = -1;

      await CompanyData.save();

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
      if(!user){ throw new Error("companty not found email not found")}
      if (req.body.OTP == user.OTP) {
        user.OTP = 0;
        user.save();
        console.log(user);
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
      res.status(200).send({
        token: token,
        userRole: userData.userRole,
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "failed",
      });
    }
  };

  static uploadProfileImage = async (req, res) => {
    try {
      if (!isImage(req.file.originalname)) {
        throw new Error("only images allowed");
      }
      let user = await CompanyModel.findOne({ _id: req.company._id });
      const uploadedData = await cloudinaryhelper({
        path: req.file.path,
        folder: `compnay/${user._id}`,
      });

      user.image = uploadedData.secure_url;
      await user.save();

      res.send(user.image);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
      });
    }
  };


  static getCompanyData = async (req, res) => {
 
    res.send({
      apiStatus: true,
      data: {
        name: req.company.name,
        number: req.company.number,
        email: req.company.email,
        about: req.company.about,
        country: req.company.country,
        image: req.company.image,
        city: req.company.city,
        numberOfemployee: req.company.numberOfemployee,
      

      },
      message: "data featched",
    });
  };

  static logout = async (req, res) => {
    try {
     
      req.company.tokens = req.company.tokens.filter((tok) => req.token != tok.token);
      await req.company.save();
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
      console.log(req.user);
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
}
module.exports = company;
