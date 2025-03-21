const express =require("express")
const router = express.Router()
const {sendForgotPasswordLink ,enterCode , resetThePassword} = require ("../Controller/passwordController")
// api/password/forgot-password
router.route("/forgot-password").post(sendForgotPasswordLink)

// api/password/enter-code/:id
router.route("/enter-code/:id").post(enterCode)

// api/password/reset-password/:id
router.route("/reset-password/:id").post(resetThePassword)

module.exports = router