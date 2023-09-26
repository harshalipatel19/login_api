//send email
const nodemailer = require("nodemailer");
const {SMTP_MAIL,SMTP_PASSWORD } = process.env
const sendEmail = async(email,mailsubject,content)=>{
try{
     const transport = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure : false,
        requireTLS:true,
        auth:{
            user:SMTP_MAIL,
            pass:SMTP_PASSWORD
        }
    });
    const mailoption = {
        from:'admin@gmail.com',
        to:email,
        subject:mailsubject,
        html:content
    }
    transport.sendMail(mailoption,function(err,info){
        if(err){
            console.log(err.message);
        }else{
            console.log("mail sent successfully",info.response);
        }
    })

}catch(error){
console.log(error.message);
}
}


module.exports = {
    sendEmail
}