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
  static getUserPosts= async(req,res)=>{
    const startingPoint=(req.params.start-1)*10 
    const userId=req.params.id
    const lastPostSeen = req.query.lastPostSeen || Date.now();
    let isUpdated
    try{
    const followObj=await Follow.findById(userId)
    const posts=await Post.find({user:{$in:followObj.companyId },updatedAt:{ $lt: lastPostSeen }})
    .populate('user')
    .sort({ updatedAt: -1 })
    .skip(startingPoint)
    .limit(10)
    const pp=await Post.find({user:{$in:followObj.companyId },updatedAt:{ $gt: lastPostSeen }}).count()
    if(pp>startingPoint)
    isUpdated=false
    else
    isUpdated=true
    res.json({
      apiStatus: true,
        data: posts,
        isUpdated:isUpdated
    })
    }
    catch(err){
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }

    
  }
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
