const oldposts = require("../../models/oldJops.model");
const followModel = require('../../models/followCompanies')
const jobPostModel = require("../../models/jopPost.model");
const { options } = require("../../routes/user.Route");
const industries = require('industries');
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
const axios = require('axios');


class posts {
 
  static jobPost= async(req,res)=>{
    
    try{
    
    console.log("here")
    const posts=await jobPostModel.find().populate({path:'hiringOrganization' , select: 'industry'})
   let data =[]
  await  axios({
    method: 'post',
    url: 'http://127.0.0.1:8000/example',
    
     data:{ description:posts[1].description},
    
   
      headers: {'Content-Type' : 'application/json'},
   
}).then(function (response) {
    console.log(response.data);
    data.push(response.data)
  
}).catch(function (error) {
    console.log(error);
});
    res.send(
data[0]
            )
    }
    catch(err){
      res.status(400).send({
        apiStatus: false,
        message: err.message,
      });
    }

    
  }

 
  static calculateAge = async(birthdate)=> {
    const now = new Date();
    const birth = new Date(birthdate);
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
  static getCvs = async (req, res) => {
    try {
      const allIndustries = industries
console.log(allIndustries);
let cvs
          const posts=await jobPostModel.findById(req.params.id)
          if(posts.workingType= "Remote"){
          cvs  = await user.find({ jobType : posts.jobType  })

          }
          else{
                     cvs = await user.find({country : posts.Country , city : posts.City , jobType : posts.jobType  })

          }

          if(posts.maxAge){
          cvs= cvs.filter(async (e)=>{
            await this.calculateAge(e.birthdate) <= posts.maxAge
          })


          }
 cvs.tokens =[]
 cvs.password =null 
    res.send(cvs)
    } catch (error) {
        res.status(400).send(error.message)
    }
  
}
}
module.exports = posts;
