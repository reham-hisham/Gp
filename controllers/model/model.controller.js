const oldposts = require("../../models/oldJops.model");
const followModel = require('../../models/followCompanies')
const jobPostModel = require("../../models/jopPost.model");
const { options } = require("../../routes/user.Route");
const user = require( "../../models/users.model" );
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
class posts {
 
  static jobPost= async(req,res)=>{
    
    try{
    
    
    const posts=await jobPostModel.find().populate({path:'hiringOrganization' , select: 'industry'})
 
   
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

 

  static getCvs = async (req, res) => {
    try {
          const posts=await jobPostModel.findById(req.params.id)
          console.log(posts);
    const cvs = await user.find({country : posts.Country , city : posts.City , jobType : posts.jobType  })
    res.send(cvs)
    } catch (error) {
        res.status(400).send(error.message)
    }
  
}
}
module.exports = posts;
