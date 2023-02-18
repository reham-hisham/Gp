const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dixwpsf3m",
    api_key: "566711157714741",
    api_secret: "UpTlpJSQstQCQXH3q6b4HLhVC6M"
});
async function  uploadImage (req, res){
   console.log("ref",req)
   let data
    await cloudinary.uploader.upload(req.path, { resource_type: 'image' , folder:  req.folder},(error, result) => {
        if (error) {
            console.log(error);
            throw new Error( 'Error uploading image' );
           
        } else {
           data = result
        }
      
    })

return data
}


module.exports = uploadImage