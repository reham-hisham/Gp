const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const followageSchemaCompany = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'company' }],
    followedAt: { type: Date, default: Date.now }
  });
  console.log("new model added");
  const companyModel= mongoose.model("followCompany" , followageSchemaCompany)
    module.exports= companyModel