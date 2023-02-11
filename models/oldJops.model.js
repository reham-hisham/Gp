const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const oldjobPostSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  aboutTheCompany: {
    type: String,
  },

  SkillsNiceToHave: [
    {
      SkillName: String,
    },
  ],
  skillsMustHave: [
    {
      SkillName: String,
      yearsOfExperience: { minYears: Number, maxYears: Number },
      },
  ],
  jobRequirements: [
    {
      type: String,
      },
  ],
  datePosted: {
    type: Date,
  },
  // validThrough: {
  //   type: Date,

  // },
  employmentType: {
    enum: ["women", "men"],
  },
  numberOfresivedCVs: {
    type: Number,
  },
  numberOFCvs: {
    type: Number,
  },
  hiringOrganization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  workingType: {
    enum: ["On-site", "Remote", "Hybrid"],
  },
  jobType: {
    enum: ["Full-Time", "Part-Time", "Internship", "other"],
  },
  jobLocation: {
    type: Object,

    address: {
        addressRegion: {
        type: String,
          },
      City: {
        type: String,
          },
      Country: {
        type: String,
          },
    },
  },
  baseSalary: {

    currency: {
      type: String,
    },
    value: { minYears: Number, maxYears: Number },
  },
  Benefits: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("oldJobPost", oldjobPostSchema);
