const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("../models/Connection/databaseConnection");
app.use(cors());
app.use(express.json());

const adminRoute = require('./admin.Route')
const userRoute = require('./user.Route')
const CompanyRoute = require('./Company.Route.js')
app.use("/admin", adminRoute)
app.use("/user", userRoute)
app.use("/company", CompanyRoute)
module.exports = app;

