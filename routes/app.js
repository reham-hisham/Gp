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
const model = require ('./model.Route')
app.use("/admin", adminRoute)
app.use("/model", model)

app.use("/user", userRoute)
app.use("/company", CompanyRoute)
module.exports = app;

// missing 
// 1- company get all cvs && download cv // wait
// 2- delete cv 
// 3- edit cv 
// 4- delete profile image // reham
// 5- follow company // hussen
// 6- search for companies and other users // hussen 
// 7- edit company data // reham
// 8- add job post // reham
// 9- filter cv -> { wait untill model work} // wait
// 10- get post related ll follow list 
// 11- admin add block edit admin // reham
// 12-  delete job post 
// 13-  block company 
// 14-  block user 
// 15- confirm activation for company 
// 16- send email to company && user 
// 17- send job offer // wait
// 18- view user account 