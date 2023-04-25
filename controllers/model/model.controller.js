const oldposts = require("../../models/oldJops.model");
const followModel = require('../../models/followCompanies')
const jobPostModel = require("../../models/jopPost.model");
const { options } = require("../../routes/user.Route");
class posts {
 
  static jobPost= async(req,res)=>{
    
    try{
    
    
    const posts=await jobPostModel.find()
 
   
    res.json({
      apiStatus: true,
        data: posts    })
    }
    catch(err){
      res.status(400).send({
        apiStatus: false,
        message: err.message,
      });
    }

    
  }

 

  static getCompanyData = async (req, res) => {
    res.send({
      apiStatus: true,
      data: {
        name: req.user.name,
        number: req.user.number,
        email: req.user.email,
        about: req.user.about,
        country: req.user.country,
        image: req.user.image,
        city: req.user.city,
        numberOfemployee: req.user.numberOfemployee,
        industry :req.user.industry

      },
      message: "data featched",
    });
  };
}
module.exports = posts;
