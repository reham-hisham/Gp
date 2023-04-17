const oldposts = require("../../models/oldJops.model");

const jobPostModel = require("../../models/jopPost.model");
class posts {
  static create = async (req, res) => {
    try {
      const post = await jobPostModel.create(req.body);
      post.hiringOrganization = req.user._id;
      await post.save();
      res.status(200).send(post);
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
