const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobPostSchema = new Schema({
  title: {
    type: String,
    required :true
  },
  description: {
    type: String,
    required :true
  },
  industry  :{
    type:String,
    enum: [
      "Management",
      "Marketing and Advertising",
      "Sales",
      "Customer Service",
      "Human Resources",
      "Accounting and Finance",
      "Information Technology",
      "Engineering",
      "Operations and Logistics",
      "Research and Development",
      "Legal and Regulatory Affairs",
      "Health and Safety",
      "Quality Control and Assurance",
      "Supply Chain Management",
      "Project Management",
      "Product Development",
      "Consulting",
      "Education and Training",
      "Administration and Support",
      "Media and Communications",
      "Agriculture and Farming",
      "Mining and Extraction",
      "Construction",
      "Transportation and Logistics",
      "Energy and Utilities",
      "Financial Services",
      "Healthcare and Pharmaceuticals",
      "Hospitality and Tourism",
      "Retail and Wholesale",
      "Real Estate",
      "Media and Entertainment",
      "Government and Public Services",
      "other"
    ]
   },
  aboutTheCompany: {
    type: String,
  },

  SkillsNiceToHave: {

    
      Type: Array,

    
  }
  ,
  skillsMustHave: [
    {
      Skill: [{
     SkillName:{   type: String,
        required: true,},
      
      yearsOfExperience: {
        minYears: {
          type: Number,
          required: true,
        },
        maxYears: {
          type: Number,
          required: true,
        },
      },}
      ],
  },
  ],
  baseSalary: {
  

    currency: {
      type: String,
    },
    value: { minValue: Number, maxValue: Number },
  },
  jobRequirements: [
    {
      type: String,
      
   
    },
  ],

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
   
    ref: "Company",
  },
  workingType: {
    enum: ["On-site", "Remote", "Hybrid"],
   
  },
  jobType: {
    enum: ["Full-Time", "Part-Time", "Internship", "other"],
   
  },


    address: {
      type:String,
      required: true,
    },
      
      City: {
        type: String,
        required: true,
      },
      Country: {
        type: String,
        required: true,
      
    },
  
  maxAge:Number,
  

  Benefits: [
    {
      type: String,
    },
  ],
  
} , { timeStamp: true });

module.exports = mongoose.model("JobPost", jobPostSchema);
/*"description":"we need a software",
"aboutTheCompany":"3laa alll lllaaah ",
"SkillsNiceToHave":["good ", "handsome", "latif kda wmsh bta3 mshakl"],
"skillsMustHave":[{"Skill":[{"SkillName":"css" , "yearsOfExperience":{"minYears":4 , "maxYears":10}},{"SkillName":"css" , "yearsOfExperience":{"minYears":4 , "maxYears":10}}]}],
"jobRequirements":"bka bka asjbdajkdbaui",
"employmentType":"women",
"numberOfresivedCVs":100,
"numberOFCvs":54,
"workingType":"Remote",
"jobType":"Internship",
"City":"giza",
"Country":"cairo",
"maxAge":44,
"baseSalary":{
"currency":"dollar",
"value":{
"minValue":5,
"maxValue":45
}
},
"Benefits":["good"]
}*/