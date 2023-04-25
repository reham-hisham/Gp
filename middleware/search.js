const company = require("../models/company.model");
const user=require("../models/users.model")
const search=async (req,res)=>{
    try{
    const query = req.query.q;
    let resulSearch={}
  const regex = new RegExp(query, 'i');
  const users = await user.find({
    $or: [
      { name: { $regex: regex } },
      { title: { $regex: regex } },
      { jobTitles: { $regex: regex } },
      { industry: { $regex: regex } }
    ]
  });
  const companies= await company.find({
    $or: [
      { name: { $regex: regex } },
      { industry: { $regex: regex } }
    
    ]
  });
  if(users){
    resulSearch.push({users: users})
    
  }
  if(companies){
    resulSearch.push({companies: companies})
    
  }

res.status(200).send(resulSearch)
}catch(err){
    res.status(400).send({
        apiStatus: false,
        data: error.message,
      });
  }
}