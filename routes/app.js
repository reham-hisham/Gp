const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());

app.use(express.json());


require("../models/Connection/databaseConnection");
const adminRoute = require('./admin.Route')
const userRoute = require('./user.Route')
const CompanyRoute = require('./Company.Route.js')
app.use("/admin", adminRoute)
app.use("/user", userRoute)
app.use("/company", CompanyRoute)
module.exports = app;

