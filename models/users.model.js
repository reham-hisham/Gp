const mongoose = require("mongoose");
const validator = require("validator");
const isphone = require("is-phone");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let regex = new RegExp(
  /^(?!.\s)(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[~`!@#$%^&()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    number: {
      type: String,
      required: true,
      validate(val) {
        if (!isphone(val)) {
          throw new Error("Invalid Phone Number");
        }
      },
    },
    city: {
      type: String,
      required: true,
      max: 200,
    },
    country: {
      type: String,
      required: true,
      max: 200,
    },
    address: {
      type: String,
      required: false,
      max: 200,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val)) throw new Error("Invalid email");
      },
    },
    password: {
      type: String,
      required: true,
    },

    OTP: {
      type: String,
    },
    birthdate: {
      type: String,
      required: true,
    },
    isBlocked: { type: Boolean, default: false },
    tokens: [
      {
        token: {
          type: String,
          trim: true,
        },
      },
    ],
    title: {
      type: String,
    },
    jobTitles: {
      type: Array,
      required: false,
    },
    minSalary: {
      value: { type: Number,       required: false,
      },
      currency: String,
    },
    industry: {
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
    yearsOfExperience: Number,
    image: String,
    cv: String,
    public_id: String,
    skills: [
      {
        SkillName: String,
        yearsOfExperience: Number,
      },
    ],

    currentCareerlevel: {
      enum: [
        "Student",
        "Entry Level",
        "Experienced",
        "Manager",
        "senior Management",
      ],
    },
    jopType: {
      enum: [
        "Full Time",
        "Part Time",
        "intership",
        "other"
      ],
    },
    currentEducationalLevel: {
      enum: [
        "Bachelors Degree",
        "Master Degree",
        "Doctorate Degree",
        "High school",
        "Vocational",
        "Diploma",
      ],
    },
    fieldOfStudy: String,
    University: String,
    GraduationYear: String,
    Grade: String,
    languages: [],
  },
  { timeStamp: true }
);

// encrypt password , 8=> random number could be any number between  1 ~10
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});
userSchema.statics.login = async function (email, password) {
  // user pasword and email
  const userData = await user.findOne({ email });

  //check user email
  if (!userData) {
    throw new Error("invalid Email");
  }

  // check user password
  const validPassword = await bcrypt.compare(password, userData.password);
  if (!validPassword) {
    throw new Error("invalid password");
  }
  // return user data if valid login
  return userData;
};
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.jwtKey);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const user = mongoose.model("User", userSchema);
module.exports = user;
