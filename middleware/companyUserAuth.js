const jwt = require("jsonwebtoken");
const Company = require('../models/company.model');
const userModel = require( "../models/users.model" );

const CompanyAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const d_token = jwt.verify(token, "keykey");

    const company = await Company.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });
    if (!company) {
      const user = await userModel.findOne({
            _id: d_token._id,
            "tokens.token": token,
          })
          if(!user){
            throw new Error("not allawed")
          }
          req.user = user;
          req.token = token;
    }else{
        req.user = company;
        req.token = token;
    }

    next();
  } catch (e) {
    res.status(400).send({
      apiStatus: false,
      date: e.message,
      message: "not Authorizated ",
    });
  }
};

module.exports = CompanyAuth;
