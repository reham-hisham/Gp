const nodemailer = require("nodemailer")
const emailInfo = {
    service:"gmail",
    auth:{
        user:"perssagency@gmail.com",
        pass:"zwotpzxcugbuxdsh"
    }
}
const sendMyEmail = async (details)=>{
    try{
        const transporter = await nodemailer.createTransport(emailInfo)
        const mailOptions = {
            from:"perssagency@gmail.com",
            to: details.userEmail,
            subject:details.subject,
            html: details.contant
        }
        await transporter.sendMail(mailOptions)
    }
    catch(e){
        console.log(e.message)
    }
}

module.exports = sendMyEmail