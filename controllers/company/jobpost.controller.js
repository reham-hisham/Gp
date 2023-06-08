const oldposts = require("../../models/oldJops.model");

const jobPostModel = require("../../models/jopPost.model");
const model = require("../model/model.controller")
class posts {
  static create = async (req, res) => {
    try {
      console.log(req.body.industry)
      const post = await jobPostModel.create(req.body);
      post.hiringOrganization = req.user._id;
      await post.save();
      cons
     await model.getCvs(post , res)
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding post",
      });
    }
  };
  static deleteJobPost = async (req, res)=>{
    try {
      await jobPostModel.findOneAndDelete({_id:req.params.id , hiringOrganization:req.user._id})
      res.send("deleted")
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        error: error.message,
        message: "error delete post",
      });
    }
  }
}
module.exports = posts;
