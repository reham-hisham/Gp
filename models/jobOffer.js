const mongoose = require("mongoose");
<<<<<<< HEAD
=======
const company=require('..//models/company.model')
>>>>>>> c6435e0d06e112246ee45787740671d875b13754
const offerSchema = mongoose.Schema(
  {
    companyId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jobId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
    },

    offerContent: { required: true, type: String },

    offerType: {
      type: String,
      enum: [
        "General Interview",
        "Technical Interview",
        "Hr Interview",
        "Job Offer",
      ],
    },
    offerAcceptance: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    comment: {
      type: String,
      default: null,
    },
  },
  { timeStamps: true }
);
const jobOffer = mongoose.model("jobOffers", offerSchema);
module.exports = jobOffer;
