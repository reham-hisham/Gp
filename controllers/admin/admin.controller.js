const AdminModel = require("../../models/Admin.model");
const PostModel = require("../../models/post.model")
const JobPostModel = require("../../models/jopPost.model")

const Email = require('../../helper/sendEmail')
class Admin {

  static login = async (req, res) => {

    try {
      const AdminData = await AdminModel.login(req.body.email, req.body.password);
     
   if(!AdminData){
    throw new Error("not found as admin")
   }
      const token = await AdminData.generateToken();
      res.status(200).send({
      token: token 
        
      });
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "failed",
      });
    }
  };
  static register = async (req, res) => {
    try {
      const admin = new AdminModel(req.body);
      await admin.save();
     
      res.status(200).send();
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
        message: "error adding user",
      });
    }
  };  static deletePost = async (req, res)=>{
    try {
      await PostModel.findByIdAndDelete(req.params.id )
      res.send("deleted")
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        error: error.message,
        message: "error delete post",
      });
    }
  }
  static sendEmail = async (req,res)=>{
    try {
     await Email({userEmail: req.body.userEmail ,subject:req.body.subject , contant:req.body.contant})
      res.send("Done")
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        error: error.message,
        message: "error sending email",
      });
    }
  }
  static deleteJobPost = async (req, res)=>{
    try {
      await JobPostModel.findOneAndDelete({_id:req.params.id })
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
module.exports = Admin;
