const oldposts = require('../../models/oldJops.model')

const jopPostModel = require( '../../models/jopPost.model' );
 class posts {
    static create= async(req, res)=>{
        try {
           const post = await jopPostModel.create(req.body)
           post.hiringOrganization = req.company._id
           await post.save()
            res.status( 200 ).send( 
                post
            );
        } catch (error) {
            res.status( 400 ).send( {
                apiStatus: false,
                data: error.message,
                message: "error adding user",
            } );
        }
    }
 }
 module.exports = posts