const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followageSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'company' }],
    followedAt: { type: Date, default: Date.now }
  });

  module.exports= mongoose.model("follow" , followageSchema)