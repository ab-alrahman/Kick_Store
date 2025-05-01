const express = require("express")
const router = express.Router()
const {register , login} = require ("../Controller/authController")
const photoUpload = require("../middlewares/photoUpload");

// /api/auth/register
router.post("/register",photoUpload.single('image'),register)  

// /api/auth/login
router.post("/login",login)  
module.exports = router

/*
    show product > add product 
    cart > checkout > order > payment + info > create order {
    payment 
    user
    cartId
    }



*/