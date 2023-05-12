const mongoose = require("mongoose");
const validator = require("validator");
const isphone = require("is-phone");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let regex = new RegExp(
  /^(?!.\s)(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[~`!@#$%^&()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/
);

const CompanySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about:String,
   
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
    image:{
        type:String
    },
  
numberOfemployee:{
    type:Number
},
    isBlocked: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },

    tokens: [
      {
        token: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timeStamp: true }
);

// encrypt password , 8=> random number could be any number between  1 ~10
CompanySchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});
CompanySchema.statics.login = async function (email, password) {
  // user pasword and email
  const userData = await this.findOne({ email });

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
CompanySchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, userRole: user.userRole },
    process.env.jwtKey
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
