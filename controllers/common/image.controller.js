const isImage = require("is-image");
const cloudinaryhelper = require("../../middleware/cloudinary");
const cloudinary = require("cloudinary");

class Image {
  static uploadImage = async (req, res) => {
    try {
      if (!isImage(req.file.originalname)) {
        throw new Error("only images allowed");
      }
      const uploadedData = await cloudinaryhelper({
        path: req.file.path,
        folder: `compnay/${req.user._id}`,
      });

      req.user.image = uploadedData.secure_url;
      req.user.public_id=uploadedData.public_id
      await req.user.save();

      res.send(req.user.image);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        data: error.message,
      });
    }
  };

  static deleteImage = async (req, res) => {
    try {
      let e;
      if (req.user.image) {
      /*  let imageName = req.user.image.split("upload/")[1];
        imageName = imageName.split("/");
        imageName = imageName[1] + "/" + imageName[2];
        console.log(imageName);
        imageName = imageName.split(".")[0]; */
        await cloudinary.uploader.destroy(
          req.user.public_id,
          { location: `compnay/${req.user._id}` },
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
        if (e) {
          throw new Error(e.result);
        }

        req.user.image = null;
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
