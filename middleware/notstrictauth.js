const jwt = require("jsonwebtoken");
const userModel = require("../models/users.model");
const Company = require('../models/company.model');

const auth = async (req, res, next) => {
let user,company
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if(token){
         const d_token = jwt.verify(token,"keykey");
     user = await userModel.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });

    if (user) {
  req.user = user;
    req.token = token;
    }
   if(!user){
    
     company = await Company.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });
   }
   if(company){
    req.user = company;
    req.token = token;
   }
    next();
    }
  
  } catch (e) {
console.log(e);
   next()
  }
};

module.exports = auth;
