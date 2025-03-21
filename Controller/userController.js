const asyncHandler = require("express-async-handler")
const bcrypt=require("bcryptjs")
const{User,validateUpdaterUser} = require("../Models/User")

/**
 * @desc Update User 
 * @route /api/users/:id
 * @method PUT
 * @access private
 */
const updateUser = asyncHandler(async(req,res)=>{
    if(req.user.id != req.params.id){
        return res.status(403).json({message : "You are not allowed"})
    }
    const {error} = validateUpdaterUser(req.body)
    if(error){
        return res.status(400).json({message : error.details[0].message})
    }
    console.log(req.headers)
    if(req.body.password){
        const salt = await bcrypt.genSalt(10)
        req.body.password =await bcrypt.hash(req.body.password , salt)
    }
    const updateduser = await User.findByIdAndUpdate(req.params.id,{
        $set : {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName
        }
    },{new : true}).select("-password")
    res.status(200).json(updateduser)
})

/**
 * @desc Get All User 
 * @route /api/users
 * @method GET
 * @access private (Only admin)
 */
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select("-password")
    res.status(200).json(users)
})

/**
 * @desc Get User By ID 
 * @route /api/users/:id
 * @method GET
 * @access private (Only admin & him self)
 */
const getUserByID = asyncHandler(async(req,res)=>{
    const users = await User.findById(req.params.id).select("-password")
    if (users) {
        res.status(200).json(users)
    } else {
        res.status(404).json({message : "user not found"})
    }
})

/**
 * @desc Delete User 
 * @route /api/users/:id
 * @method DELETE
 * @access private (Only admin & him self)
 */
const deleteUser = asyncHandler(async(req,res)=>{
    const users = await User.findById(req.params.id).select("-password")
    if (users) {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"user has been deleted successfully"})
    } else {
        res.status(404).json({message : "user not found"})
    }
})


module.exports = {
    updateUser,
    getAllUsers,
    getUserByID,
    deleteUser
}