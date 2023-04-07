const userModel = require("../../models/users.model");
const cloudinaryhelper = require("../../middleware/cloudinary");
const isImage = require("is-image");
const otp = require("../../helper/sendOTP");
const sendEmail = require("../../helper/sendEmail");
const cloudinary = require("cloudinary");
const Image = require( "../common/image.controller" );

// Get instance by resolving ClamScan promise object

// OTP = 0 -> can login
class User extends Image{
  static register = async (req, res) => {
    try {
      const userData = new userModel(req.body);
      await userData.save();
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

  static addCV = async (req, res) => {
    try {
      let user = await userModel.findOne({ _id: req.user._id });
      const uploadedData = await cloudinaryhelper({
        path: req.file.path,
        folder: `${user.id}/cv`,
      });

      user.cv = uploadedData.secure_url;
      await user.save();

      res.send();
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
      });
    }
  };
  static addImage = async (req, res) => {
    try {
      if (!isImage(req.file.originalname)) {
        throw new Error("only images allowed");
      }
      let user = await userModel.findOne({ _id: req.user._id });
      const uploadedData = await cloudinaryhelper({
        path: req.file.path,
        folder: user._id,
      });

      user.image = uploadedData.secure_url;
      console.log(user.image);
      await user.save();

      res.send();
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
      });
    }
  };
  static login = async (req, res) => {
    try {
      const userData = await userModel.login(req.body.email, req.body.password);
      console.log(userData)
      if (userData.isBlocked) {
        throw new Error("Blocked ");
      }
      const token = await userData.generateToken();
      if (userData.OTP != 0) {
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

static deleteProfileImage = async (req , res )=>{
 this.deleteImage(req, res)
};

  //error
  static getUserData = async (req, res) => {
   req.user.password =null
   req.user.tokens = null
    res.send(req.user);
  };

  static logout = async (req, res) => {
    // remove token
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
    await userModel.deleteOne({ id: req.user._id });
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
      const userUpdated = await userModel.findByIdAndUpdate(
         req.user._id ,
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

  static SendOTP = async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.body.email });
      if (user) {
        let Otp = otp(6);

        await sendEmail({
          userEmail: req.body.email,
          subject: "welcom ",
          contant: ` Plaese enter this otp : ${Otp} to confirm your email`,
        });
        user.OTP = Otp;
        await user.save();
        return res.send({ email: req.body.email, id: user._id, otp: Otp });
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

      let user = await userModel.findOne({ email: req.body.email });
      console.log(user)
      if (req.body.OTP == user.OTP) {
        user.OTP = 0;
      await  user.save();
      
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
  static ResetPassword = async (req, res) => {
    try {
      let user = await userModel.findOne({ _id: req.params.id });
      if (user.OTP != 0) {
        throw new Error("user should enter otp ");
      }

      user.password = req.body.password;
      user.OTP = 0;
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
module.exports = User;
