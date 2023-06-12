const userModel = require("../../models/users.model");
const jobPostModel = require("../../models/jopPost.model");
const model = require("../model/model.controller");
class posts {
  static create = async (req, res) => {
    try {
      console.log(req.body.industry);
      const post = await new jobPostModel(req.body);
      post.hiringOrganization = req.user._id;

     
      await post.save();
      await model.getCvs(post , res )
     /*  */
      //  await model.getCvs(post , res)
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding post",
      });
    }
  };
  static deleteJobPost = async (req, res) => {
    try {
      await jobPostModel.findOneAndDelete({
        _id: req.params.id,
        hiringOrganization: req.user._id,
      });
      res.send("deleted");
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        error: error.message,
        message: "error delete post",
      });
    }
  };
  static getAllJobPosts = async (req, res) => {
    try {
     const jobpost= await jobPostModel.find({
        hiringOrganization: req.user._id,
      }).populate({path :"matchedUsers.userId" , select:"name email cv"})
      res.send(jobpost);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        error: error.message,
        message: "error delete post",
      });
    }
  };
  static getOneJobPosts = async (req, res) => {
    try {
      const jobpost = await jobPostModel
        .findOne({
          _id: req.params.id,
          hiringOrganization: req.user._id,
        })
        .populate({
          path: "matchedUsers.userId",
          select: "name email cv title",
        });
      res.send(jobpost);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        error: error.message,
        message: "error delete post",
      });
    }
  };
}
module.exports = posts;
