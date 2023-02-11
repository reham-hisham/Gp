const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dwfranki5',
    api_key: '453787911783778',
    api_secret: 'M60o5_k2wRwzoQesUt4GOxZyfWM'
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