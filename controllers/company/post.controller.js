const oldposts = require("../../models/oldJops.model");
const followModel = require("../../models/followCompanies");
const PostModel = require("../../models/post.model");
const { options } = require("../../routes/user.Route");
const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");

class posts {
  static create = async (req, res) => {
    try {
      const post = await new PostModel(req.body);
      post.user = req.user._id;
      if (!isImage(req.file.originalname)) {
        throw new Error("only images allowed");
      }

      const uploadedData = await cloudinaryhelper({
        path: req.file.path,
        folder: post._id,
      });

      post.image = uploadedData.secure_url;
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
        createdAt: { $lt: lastPostSeen },
      })
      .populate({
        path: "user",
    
        select: " name email image",
      })
        .sort({ createdAt: -1 })
        .limit(10);

      posts.forEach(post => {
        post.reactions.forEach((reaction)=>{
          if(req.user._id.toString()==reaction.user.toString())
          {
            post.isLiked=true
            
          }else{
            post.isLiked=false
          }
        })
      });
       

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

      res.send(post.reactions);
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
      post.comments.push({
        userId: req.user._id,
        text: req.body.comment,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
      });
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
      const posts = await PostModel.findById(req.params.id).populate({
        path: "commentsUsers commentsCompany",
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
  static getCompanyPosts = async (req, res) => {
    const lastPostSeen = req.body.lastPostSeen || Date.now();
    try {
      const posts = await PostModel.find({ userId:req.user._id,createdAt: { $lt: lastPostSeen }})
          .populate({
            path: "user",

            select: " name email image",
          })
          .sort({ createdAt: -1 })
          
          .limit(10);
      if (req.user) {
        posts.forEach((element) => {
          element.reactions.forEach((reaction) => {
            if (reaction.user.toString() == req.user._id.toString()) {
              element.isLiked = true;
            }
          });
        });
      }else{
        posts.forEach((element) => {
          
              element.isLiked = false;
          
          
        });
      }

      res.send(posts);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
        message: "error getting posts",
      });
    }
  };
}
module.exports = posts;
