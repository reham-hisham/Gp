const jwt = require("jsonwebtoken");
const userModel = require("../models/users.model");
const Company = require('../models/company.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if(token){
         const d_token = jwt.verify(token,"keykey");
    const user = await userModel.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });

    if (user) {
  req.user = user;
    req.token = token;
    }
   if(!user){
    
    const company = await Company.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });
   }
   if(company){
    req.user = user;
    req.token = token;
   }
    next();
    }
  
  } catch (e) {
   next()
  }
};

module.exports = auth;
