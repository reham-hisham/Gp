const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://donya:6rtz6QZajJSlbdqk@cluster0.kpnsh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose.connect(process.env.dbUrl);
/*  "mongodb+srv://rehamhisham:reham@cluster0.mdfqgcp.mongodb.net/test"*/
mongoose.set('strictQuery', true);