
const db = require('../model')
var schemaauth = require('../helper/validation')
const secretkey  = "secret key"
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { password } = require('../config/config')


//model
const user = db.user
const password_reset = db.password_reset

const randomstring =  require('randomstring');
const sendmail = require('../helper/sendmail')

const singup_user = async(req,res)=>{  
    try{ 
    const {UserName,Email,PhoneNo,Address,DateOfBirth,Gender,Password,IsActive} = req.body;
    const { error } = schemaauth.signupvalidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
    else { 
      console.log(user);
    const existinguser = await user.findOne({where:{Email:Email}})
    if(existinguser){
     return res.status(409).json({sucess:"false",message:'user already exist'})
     
    }
    else{
      const hashpassword = await bcrypt.hash(Password, 10);
      // Store hash in the database
      const data = await user.create({UserName,Email,PhoneNo,Address,DateOfBirth,Gender,Password:hashpassword,IsActive})
    
      let mailsubject = "mail verification";
      const randomtoken = randomstring.generate();     ///generate random string token
      const content = '<p> hi <br>' + req.body.UserName+  ', \
      please <a href="http://localhost:4400/mail-verify?Token='+randomtoken+'"> verify </a> your mail.';
      sendmail.sendEmail(req.body.Email,mailsubject,content);
      var Token = {Token:randomtoken}
      const result = await user.update(Token,{where:{Email:req.body.Email}});
      if(result){
        return res.status(201).json({sucess:"true",data:result,messgae:"singup successfully"});
      }
      else{
        return res.status(500).json({sucess:"false",message:"somthing went wrong!!!"})
      }
   }
  }
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
 }


 const verifymail = async(req,res)=>{
  var Token = req.query.Token;
  const data = await user.findOne({where:{
    Token:Token
  }})
  if(data){
    var Token = {Token:'null'}
    const result = await user.update(Token,{where:{Id:data.id}})
    return res.render('verify',{message:'email verify sucessfully..'});
  }else{
    return res.render('404')
  }
}

const singin_user = async(req,res)=>{
  try{ 
    const {Email,Password,id} = req.body;
    const { error } = schemaauth.signinvalidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
    else {
    const existinguser = await user.findOne({where:{Email:Email}})
    if(!existinguser){
     return res.status(404).json({sucess:"false",message:'user not found'})
    }
    else{ 
    const Token = existinguser.Token;
    const tokenuser = (Token == "null");
    if(tokenuser === true ){
    //const matchpassword = req.body.Password == existinguser.Password
    const userpassword = req.body.Password
    const matchpassword = await bcrypt.compare(userpassword, existinguser.Password)
    const IsActive = existinguser.IsActive == 1 ; 
    if(matchpassword ==false || IsActive ==false ){
      return res.status(400).json({sucess:"false",message:"invalid credential"})
    }
    const token = jwt.sign({id:existinguser.id},secretkey);
    return res.status(200).json({sucess:"true",message:'login successfully',token:token,})
    }
    else{
      res.send({message:"please verify your email"})
    }
    }
    } 
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const profile_user_get = async(req,res)=>{
  try{
  const bearerheader = req.headers['authorization'];
  const authtoken = bearerheader.split(' ')[1];
  if(authtoken){
    const decode = jwt.verify(authtoken,secretkey) 
    console.log(decode.id); 
    let data = await user.findOne(
      {
        where: {
        id: decode.id
      }
    });
    var checkdata = data == null;
    if(!checkdata == true){ 
      res.status(200).json({
        sucess:"true",
        message:"profile access",
        user_name:data.UserName,
        email:data.Email,
        phone_number:data.PhoneNo,
        address:data.Address,
        gender:data.Gender
      })
    }
    else{
      res.status(401).json({sucess:"false",message:"user profile not found"})
    }
  }else{
    res.send({sucess:"false",message:"invalid token"})
  }
  }catch(error){
    console.log(error);
  }   
  }

const profile_user_update = async(req,res)=>{
  try{ 
    const {UserName,Email,PhoneNo,Address,DateOfBirth,Gender,Password,IsActive } = req.body; 
    const { error } = schemaauth.profileupdate.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      else{  
      const bearerheader = req.headers['authorization'];
      const authtoken = bearerheader.split(' ')[1];
      if(authtoken){
      const decode = jwt.verify(authtoken,secretkey)
      let data = await user.update(req.body,
      {
        where: {
        id: decode.id
      }
    });
    var checkdata = data[0]
    if(!checkdata == 0){ 
      res.status(200).json({sucess:"true",message:"user profile updated"})
    }
    else{
      res.status(401).json({sucess:"false",message:"user profile not update"})
    }
  }else{
    res.status(400).json({sucess:"false",message:"invalid token"})
  } 
} 
}
catch(error){
  res.json({message:"error occure"})
}
}


const forgotpassword= async(req,res)=>{
  try{  
    const {Email} = req.body; 
   // console.log(Email);
    const {error} = schemaauth.forgetpassword.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      else{
     var data = await user.findOne({where :{Email:Email}})
     
    if(data){
    let Email = data.Email;
    let mailsubject = 'forget password';
    let token= randomstring.generate();
    let content = '<p> heyy, ' +data.UserName+ '\
    please <a href = "http://localhost:4400/reset-password?token='+token+'"> Click Here </a> To Reset Password';
    sendmail.sendEmail(Email,mailsubject,content)
    console.log("token is:", token)
    const deleteuser = await password_reset.destroy({where:{Email:Email}})
    const result = await password_reset.create({Email,token})
    res.status(200).send({sucess:"true",message:"mail send successfully for reset password..."})
  }
  else{
    res.status(401).send({sucess:"false",message:"email does not exist"})
  }
}
}catch(error){
  res.json({message:"something wrong"})
} 
}


const resetpassword = async (req,res)=>{
  try{
    var token = req.query.token;
    if(token){     //check token is or not
      const result = await password_reset.findOne({where:{Token:token}}) 
      let resultLength = 0;
      resultLength = Object.keys(result).length;
      console.log("result length is:",resultLength)
      if(resultLength > 0 ){                //if token exist than find from that and check that token is correct or not
        const data = await password_reset.findOne({where:{Email:result.Email}})
          res.render('reset-password',{user:data})
      }else{
        res.status(400).render('404')
      }
    }else{
      res.render('404')
    }
    console.log("password is:",req.body.Password);
  }catch(error){
    console.log(error);
  }
}

const resetpassworduser = async (req,res)=>{
  
  if(req.body.Password  != req.body.confirm_Password){
    res.render('reset-password',{error_message:"Password Not Match..",user:{id:req.body.user_id,Email:req.body.email}})   //pass user value 
  }else{
      // const password = bcrypt.hash(req.body.confirm_password,10,async (err,hash)=>{
      // if (err){
      //   console.log(err);
      // }
      const tokendelete = await password_reset.destroy({where:{Email:req.body.email}})  //delete token from password_reset
      try{  
        const hashpassword = await bcrypt.hash(req.body.confirm_Password, 10);
        //var password = req.body.confirm_Password
        const Email = req.body.email;
        const userupdate = await user.update({Password:hashpassword},{where:{Email:Email}})  //set new password in user table
        if(userupdate == true){
          res.render('message',{message : 'password reset successfully..'})
        }else{
          res.render('message',{message:'somthing went wrong..'})
        }
      }
      catch (error) {
        console.error("Error:", error);
        res.render('message', { message: 'An error occurred.' });
      }
  }
}

module.exports ={
    singup_user,
    singin_user,
    profile_user_get,
    profile_user_update,
    verifymail,
    forgotpassword,
    resetpassword,
    resetpassworduser
}