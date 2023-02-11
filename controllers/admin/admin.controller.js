const AdminModel = require("../../models/Admin.model");

class Admin {

  static login = async (req, res) => {

    try {
      console.log("dsdf")
      const AdminData = await AdminModel.login(req.body.email, req.body.password);
      console.log(AdminData)
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

}
module.exports = Admin;
