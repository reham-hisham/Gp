const userModel = require("../../models/users.model");

const otp = require("../../helper/sendOTP");
const sendEmail = require("../../helper/sendEmail");

class User {
  static register = async (req, res) => {
    try {
      const userData = new userModel(req.body);
      userData.OTP = -1;

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
  static login = async (req, res) => {
    try {
      const userData = await userModel.login(req.body.email, req.body.password);
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
  /*not working*/
  static uploadProfileImage = async (req, res) => {
    try {
      req.user.image = req.file.destination;
      await req.user.save();
      res.send({
        apiStatus: true,
        data: req.user,
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
      });
    }
  };

  //error
  static getUserData = async (req, res) => {
    console.log(req.user.name);
    console.log(country);
    res.send({
      apiStatus: true,
      data: {
        name: req.user.name,
        number: req.user.number,
        email: req.user.email,
        birthdate: req.user.birthdate,
        country: req.user.country,
        CountryID: country.id,
        city: req.user.city,
        address: req.user.address,
      },
      message: "data featched",
    });
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
      const user = await userModel.deleteOne({ id: req.params.id });
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
      const userUpdated = await userModel.updateOne(
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

  static SendOTP = async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.body.email });
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
        return res.send({ email: req.body.email, id: user._id  ,otp :Otp});
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
  static ResetPassword = async (req, res) => {
    try {
      let user = await userModel.findOne({ _id: req.params.id });
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
module.exports = User;
