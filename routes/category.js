const { createCategoryCtrl, getAllCategoryCtrl, deleteCategoryCtrl } = require("../controller/categoriesController")
const router = require("express").Router()
const photoUpload = require("../middlewares/photoUpload")
const { verifyAdmin } = require("../middlewares/verifyToken")

// router.route("/")
//     .post(verifyAdmin,photoUpload.single("image") , createCategoryCtrl)
//     .get(getAllCategoryCtrl)
// router.route("/:id").delete(deleteCategoryCtrl)

router.route("/")
    .post(photoUpload.single("image") , createCategoryCtrl)
    .get(getAllCategoryCtrl)
router.route("/:id").delete(deleteCategoryCtrl)



module.exports = router