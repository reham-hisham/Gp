const userModel = require("../../models/users.model");
const cloudinaryhelper = require("../../middleware/cloudinary");
const isImage = require("is-image");
const otp = require("../../helper/sendOTP");
const sendEmail = require("../../helper/sendEmail");
const cloudinary = require("cloudinary");
const Image = require("../common/image.controller");
const companyModel = require("../../models/company.model");
const user = require("../../models/users.model");
const followModel = require("../../models/followCompanies")
const postModel = require('../../models/post.model')
// Get instance by resolving ClamScan promise object
const { Country, State, City } = require("country-state-city");
// OTP = 0 -> can login
class User extends Image {
  static register = async (req, res) => {
    try {
      const userData = new userModel(req.body);
      userData.minSalary = { value: req.body.minSalary }
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
      user.public_id = uploadedData.public_id
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
      if (userData.isBlocked) {
        throw new Error("Blocked ");
      }
      const token = await userData.generateToken();
      if (userData.OTP != 0) {
        console.log(userData.OTP);
        throw new Error("please validate your account first");
      }

      res.status(200).send({
        userObject: {
          id: userData._id,
          token: token,
          name: userData.name,
          email: userData.email
        }
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "failed",
      });
    }
  };
  static ultimateFollow = async (req,res)=>{
    const userId = req.user._id;
    const compId = req.params.id;
    let isFollowed=false

    try {
      let followObject = await followModel.findOne({followerId:userId});
      if(!followObject){
        followObject=await followModel.create({followerId:userId,companyId:compId})
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
  static unFollowCompany = async (req, res) => {
    const followerId = req.user._id;
    const comapanyId = req.params.userId;

    try {
      const follow = await Follow.findOne({ followerId });

      if (follow) {
        follow.companyId.pull(comapanyId);
        await follow.save();
        res.send({ msg: "modified succ" });
      } else {
        res.status(404).send({ error: 'Follow model not found' });
      }
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
      })
    }

  }

  static deleteProfileImage = async (req, res) => {
    this.deleteImage(req, res)
  };


  static getUserData = async (req, res) => {
    req.user.password = null
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
        req.user._id,
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
  static getAllCountrisInWorld = async (req, res) => {
    try {
      let country = Country.getAllCountries();
      let countries = [];
      country.forEach((element) => {
        countries.push(element.name);
      });
      res.send(countries);
    } catch (error) {
      res.status(400).send(e.message);
    }
  };
  static getcities = async (req, res) => {
    try {
      let CountryReq = Country.getAllCountries().filter(
        (e) => e.name == req.body.country
      );


      let states = State.getStatesOfCountry(CountryReq[0].isoCode);
let cities =[]
      states.forEach((state) => {
       
          cities.push(  state.name.replace(" Governorate", ""))
        
      });
     

      res.status(201).send(cities);
    } catch (e) {
      res.status(400).send(e.message);
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
      if (req.body.OTP == user.OTP) {
        user.OTP = 0;
        await user.save();

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

  static viewAccount = async (req, res) => {

    try {
      const account = await userModel.findById(req.params.id)
      account.password = null
      account.tokens = []
      account.OTP = null

      res.send(account);

    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }
  }
  static search = async (req, res) => {
    try {
      const query = req.body.search;
      let resulSearch = []
      const regex = new RegExp(query, 'i');
      const users = await userModel.find({
        $or: [
          { name: { $regex: regex } },
          { title: { $regex: regex } },
          { jobTitles: { $regex: regex } },
          { industry: { $regex: regex } }
        ]
      });
      const companies = await companyModel.find({
        $or: [
          { name: { $regex: regex } },
          { industry: { $regex: regex } }

        ]
      });
      if (users) {
        let user={}
        users.forEach(element => {
              user.data = element
                  user.type ="user"

        
        });
        resulSearch.push({user: user})
      }
      if (companies) {
        let company ={}
        companies.forEach(element => {
          company = element
      
    
    });
    company.type ="company"
    resulSearch.push({company: company})
      }
console.log(resulSearch)
      res.status(200).send(resulSearch)
    } catch (err) {
      res.status(400).send({
        apiStatus: false,
        data: err.message,
      });
    }
  }
  
}
module.exports = User;
