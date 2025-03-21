const asyncHandler = require("express-async-handler")
const { User , validateChangePassword, validateCode} = require("../Models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")

/*
 * @desc Send Forgot Password Link
 * @route /password/forgot-password
 * @method POST
 * @access public
 */

module.exports.sendForgotPasswordLink  = asyncHandler (async(req,res) =>{
    const user = await User.findOne({ email : req.body.email})
if(!user){
    return res.status(404).json({ message : "user not found"})
}
const code = Math.floor(100000 + Math.random()*900000)
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.USER_EMAIL,
        pass : process.env.USER_PASS
    }
})
const mailOption = {
    from : process.env.USER_EMAIL,
    to : user.email ,
    subject : "Reset Password",
    html :`<div>
    <h4>Copy the code below to reset your password</h4>
    <p>${code}</p>
    </div>`
}
transporter.sendMail(mailOption ,function(error,success){
    if(error){
        console.log(error)
        res.status(500).json({message : "something went wrong"})
    }
    else{
        res.status(200).json({message : "Email sent "})
        user.code = code
        user.save()
    }
})
})

/*
 * @desc Enter Code
 * @route /password/enter-code/:id
 * @method POST
 * @access public
 */

module.exports.enterCode = asyncHandler(async(req,res)=>{
    const {error} = validateCode(req.body)
    if(error) {
    return res.status(400).json({message: error.details[0].message})
    }
const user = await User.findById(req.params.id)
    if (user){
        if(user.code == req.body.code){
            user.isOk = true 
            user.save()
            return res.status(200).json({message : "You Can Reset Password"})
        }
    else return res.status(403).json({message : "invalid code"})
    }
    else{
        res.status(404).json({message :"user not found"})
    }
})

/*
 * @desc Reset Password
 * @route /password/reset-password/:id
 * @method POST
 * @access public
 */

module.exports.resetThePassword = asyncHandler (async(req,res) =>{
    const {error} = validateChangePassword(req.body)
    if(error){
        return res.status(404).json({message : error.details[0].message})
    }
    try {
        const user = await User.findById(req.params.id)
        if(user.isOk){  
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password , salt)
            user.password = req.body.password
            user.code = 0
            user.isOk = false
            await user.save()
            res.status(200).json({message : "your password has changed"})
        }
        else {
            res.status(400).json({message : "invalid code"})
        }
    }
    catch(error) {
        return res.status(404).json({ message : "user not found"})
    }
})
