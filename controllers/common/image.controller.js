const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");
class Image {

static uploadImage = async(req , res) =>{


    try {
        if (!isImage(req.file.originalname)) {
          throw new Error("only images allowed");
        }
        const uploadedData = await cloudinaryhelper({
          path: req.file.path,
          folder: `compnay/${req.user._id}`,
        });
  
        req.user.image = uploadedData.secure_url;
        await req.user.save();
  
        res.send(req.user.image);
      } catch (error) {
        res.status(400).send({
          apiStatus: false,
          data: error.message,
        });
      }
    };


static deleteImage = async (req , res  )=>{
    try {
      let e;
      let imageName = req.user.image.split("upload/")[1];
      imageName = imageName.split("/");
      imageName = imageName[1] + "/" + imageName[2];
      imageName = imageName.split(".")[0];
  
      await cloudinary.uploader.destroy(imageName, function (error, result) {
        if (error.result != "ok") {
          console.log(error)
          e = error;
        } else {
          console.log(result);
        }
      });
      if (e) {
        throw new Error(e.result);
      }
   
    req.user.image= null 
    await req.user.save()
      res.send();
    } catch (error) {
      res.status(400).send(error.message);
    }
  };
}
module.exports = Image