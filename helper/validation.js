const joi = require('@hapi/joi');

const signupvalidation =  joi.object({
    UserName : joi.string().min(3).max(30),
    Email : joi.string().email().required(),
    PhoneNo: joi.string().required().min(10).max(10),
    Address: joi.string().required(),
    Gender: joi.string().required().valid("female","male"),
    Password: joi.string().required().min(4).max(8),
    IsActive: joi.string().allow(0,1),
})

const signinvalidation =  joi.object({
    Email : joi.string().email().required(),
    Password: joi.string().required().min(4).max(8), 
})

const profileupdate =  joi.object({
    UserName : joi.string().min(3).max(30),
    Email : joi.string().email(),
    PhoneNo: joi.string().min(10).max(10),
    Address: joi.string(),
    Gender: joi.string().valid("female","male"),
    Password: joi.string().min(4).max(8),
    IsActive: joi.number().allow(0,1)
})

const forgetpassword =  joi.object({ 
    Email : joi.string().email().required(),
})
module.exports = {
    signupvalidation,
    signinvalidation,
    profileupdate,
    forgetpassword
}