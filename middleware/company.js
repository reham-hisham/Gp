const jwt = require("jsonwebtoken");
const Company = require('../models/company.model')

const CompanyAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const d_token = jwt.verify(token, "keykey");

    const company = await Company.findOne({
      _id: d_token._id,
      "tokens.token": token,
    });
    if (!company) throw new Error("not Company");
    req.user = company;
    req.token = token;
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
