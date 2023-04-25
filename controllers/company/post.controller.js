const oldposts = require("../../models/oldJops.model");
const followModel = require("../../models/followCompanies");
const PostModel = require("../../models/post.model");
const { options } = require("../../routes/user.Route");
class posts {
  static create = async (req, res) => {
    try {
      const post = await new PostModel(req.body);
      post.user = req.user._id;
      await post.save();
      res.status(200).send(post);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding user",
      });
    }
  };

  // check realtion and comments
  // check time of posts
  // check images working or not
  static getUserPosts = async (req, res) => {
    const startingPoint = (req.body.start - 1) * 10;
    const lastPostSeen = req.body.lastPostSeen || Date.now();
    let isUpdated;
    try {
      const followObj = await followModel.findOne({ followerId: req.user._id });

      const posts = await PostModel.find({
        user: { $in: followObj.companyId },
        updatedAt: { $lt: lastPostSeen },
      })
        .populate({ path: "user", select: "name image _id" })
        .sort({ updatedAt: -1 })
        .skip(startingPoint)
        .limit(10);
      const pp = await PostModel.find({
        user: { $in: followObj.companyId },
        updatedAt: { $gt: lastPostSeen },
      }).count();
      if (pp > startingPoint) isUpdated = false;
      else isUpdated = true;
      res.json({
        apiStatus: true,
        data: posts,
        isUpdated: isUpdated,
      });
    } catch (err) {
      res.status(400).send({
        apiStatus: false,
        message: err.message,
      });
    }
  };
  static addReaction = async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id);
      let m = post.reactions.filter(
        (doc) => doc.user.toString() == req.user._id.toString()
      );

      if (m.length <= 0) post.reactions.push({ user: req.user._id });
      else
        post.reactions = post.reactions.filter(
          (doc) => doc.user.toString() != req.user._id.toString()
        );

      await post.save();

      res.send({ post });
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding like",
      });
    }
  };
  static addComment = async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id);
      post.comments.push({ user: req.user._id, text: req.body.comment });
      await post.save();
      res.send(post);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding like",
      });
    }
  };
  static getComments = async (req, res) => {
    try {
      const posts = await PostModel.findById(req.params.id)
        .populate({
          path: "comments.user",
          model: "User",
          strictPopulate: false,
          select: " name email image",
        })
        .populate({
          path: "comments.user",
          model: "Company",

          strictPopulate: false,
          select: " name email image",
        });
      res.send(posts);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding like",
      });
    }
  };
  static getAllReactions = async (req, res) => {
    try {
      const posts = await PostModel.findById(req.params.id)
        .populate({
          path: "reactions.user",
          model: "User",

          strictPopulate: false,
          select: " name email image",
        })

        .populate({
          path: "reactions.user",
          model: "Company",

          strictPopulate: false,
          select: " name email image",
        });

      res.send(posts);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding like",
      });
    }
  };
  static deletePost = async (req, res) => {
    try {
      await PostModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
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
  static getCompanyPosts=async(req,res)=>{
    PostModel.find({user:req.params.id}).then((data)=>{
      res.json({data,apiStatus:success})
    }).catch((error)=>{ res.status(400).send({
      apiStatus: false,
      data: error.message,
      message: "error getting posts",
    });})
  }
}
module.exports = posts;
