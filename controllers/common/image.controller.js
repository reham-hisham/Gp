const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");
const cloudinary = require("cloudinary");
const destroyImgFromCloud=async (public_id,userId) => {
  await cloudinary.uploader.destroy(
    public_id,
    { location: `compnay/${userId}` },
    function (error, result) {
      console.log(result);
      if (error.result != "ok") {
        console.log(error);
        e = error;
      } else {
        console.log(result);
      }
    }
  );
}
class Image {
  static uploadImage = async (req, res) => {
    try {
      if (!isImage(req.file.originalname)) {
        throw new Error("only images allowed");
      }
   
      if(req.user.image && req.user.public_id){

        destroyImgFromCloud(req.user.public_id,req.user._id)
        console.log("updating image");
  const uploadedData = await cloudinaryhelper({
        path: req.file.path,
        folder: `compnay/${req.user._id}`,
      });
      req.user.image=uploadedData.secure_url
      req.user.public_id=uploadedData.public_id
      }
      else if(!req.user.image && !req.user.public_id){
        const uploadedData = await cloudinaryhelper({
          path: req.file.path,
          folder: `compnay/${req.user._id}`,
        });
req.user.image = uploadedData.secure_url;
      req.user.public_id=uploadedData.public_id

      }
    

      
      await req.user.save();

      res.send({Data:req.user.image});
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
      });
    }
  };

  static deleteImage = async (req, res) => {
    try {
      console.log("deleting one");
      let e;
      if (req.user.image) {
      /*  let imageName = req.user.image.split("upload/")[1];
        imageName = imageName.split("/");
        imageName = imageName[1] + "/" + imageName[2];
        console.log(imageName);
        imageName = imageName.split(".")[0]; */
        destroyImgFromCloud(req.user.public_id,req.user._id)
       
        if (e) {
          throw new Error(e.result);
        }

        req.user.image = null;
        req.user.public_id=null
        console.log(req.user.public_id);
        await req.user.save();
        res.send();
      } else {
        throw new Error("no image to delete");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
}
module.exports = Image;
