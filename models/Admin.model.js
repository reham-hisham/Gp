const mongoose = require("mongoose");
const validator = require("validator");
const isphone = require("is-phone");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let regex = new RegExp(
  /^(?!.\s)(?=.[A-Z])(?=.[a-z])(?=.[0-9])(?=.[~`!@#$%^&()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/
);

const AdminSchema = mongoose.Schema(
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
AdminSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
});
AdminSchema.statics.login = async function (email, password) {
  // user pasword and email
  const userData = await this.findOne({ email });
  //check user email
  if (!userData) {
    throw new Error("invalid Email");
  }
console.log(password)
  // check user password
  const validPassword = await bcrypt.compare(password, userData.password);
  console.log(validPassword)
  if (!validPassword) {
    throw new Error("invalid password");
  }
  // return user data if valid login
  return userData;
};
AdminSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id},
    process.env.jwtKey
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;
