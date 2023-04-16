const oldposts = require("../../models/oldJops.model");

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
  static addReaction = async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id);
      post.reactions.push({ user: req.user._id });
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
  static addComment = async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id);
      post.comments.push({ user: req.user._id , text: req.body.comment });
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
  static getComments = async (req, res)=>{
    try {
        const posts = await PostModel.findById(req.params.id)
        .populate({
          path: "comments.user",
          model:'User',
          strictPopulate: false,
          select: " name email image",
        })
        .populate({
          path: "comments.user",
          model:'Company',

          strictPopulate: false,
          select: " name email image",
        });
        res.send(posts)
    } catch (error) {
        res.status(400).send({
            apiStatus: false,
            data: error.message,
            message: "error adding like",
          });
    }
  }
  static getAllReactions = async (req, res) => {
    try {
      const posts = await PostModel.findById(req.params.id)
        .populate({
          path: "reactions.user",
         model:'User',
    
          strictPopulate: false,
          select: " name email image",
        })

.populate({
            path: "reactions.user",
           model:'Company',
      
            strictPopulate: false,
            select: " name email image",
          })
        
      res.send(posts);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error adding like",
      });
    }
  };
  static deletePost = async (req, res)=>{
    try {
      await PostModel.findOneAndDelete({_id:req.params.id , user:req.user._id})
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
