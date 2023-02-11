const jwt = require("jsonwebtoken");
const Adminmodel = require("../models/Admin.model");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const d_token = jwt.verify(token, "keykey");
    const admin = await Adminmodel.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });

    if (admin) {
  req.admin = admin;
    req.token = token;
    next(); }
    else{
               throw new Error("not admin or supper admin");

    }
    
  } catch (e) {
    res.status(400).send({
      apiStatus: false,
      date: e.message,
      message: "not Authorizated ",
    });
  }
};

module.exports = adminAuth;
