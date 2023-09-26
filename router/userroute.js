
const userctrl = require('../controller/usercontroller.js')//const { expression } = require('joi');
const router = require('express').Router()
//const jwt = require('jsonwebtoken')
//router.get('/mail-verify',userctrl.verifymail)

router.post('/signup',userctrl.singup_user)
router.post('/singin',userctrl.singin_user)
router.put('/profile',userctrl.profile_user_update)
router.get('/profile',userctrl.profile_user_get)
router.post('/forgotpassword',userctrl.forgotpassword)
router.get('/mail-verify',userctrl.verifymail)
router.get('/reset-password',userctrl.resetpassword)
router.post('/reset-password',userctrl.resetpassworduser)

module.exports = router