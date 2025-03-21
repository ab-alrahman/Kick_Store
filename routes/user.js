const express = require("express")
const router = express.Router()
const {verifyToken ,verifyAuthorazition ,verifyAdmin } = require ("../middlewares/verifyToken")
const {updateUser,getAllUsers,getUserByID,deleteUser} = require("../controller/userController")

// /api/users/:id
router.route("/:id")
    .put( updateUser )
    .get(getUserByID )
    .delete( deleteUser)
    // .put( verifyAuthorazition , updateUser )
    // .get(verifyAuthorazition,getUserByID )
    // .delete( verifyAuthorazition, deleteUser)

// /api/users
router.get("/", getAllUsers)
// router.get("/", verifyAdmin, getAllUsers)



module.exports = router 