  const express = require("express");
  const router = express.Router();
  const {
    getAllProduct,
    getProductById,
    createPoduct,
    updateProduct,
    getProductByFilter,
    accessoriesImageUpload,
    deleteProduct,
    getAllColorsAndSizes, // Import the new controller
  } = require("../Controller/productController");
  const photoUpload = require("../middlewares/photoUpload");
  const { verifyAdmin } = require("../middlewares/verifyToken");
  const validId = require("../middlewares/validateId")

  // Specific routes must come before dynamic routes
  router.route("/colors-sizes").get(getAllColorsAndSizes);

  router
    .route("/accessories-image-upload/:id")
    .post(
      verifyAdmin,
      photoUpload.fields([{ name: "accessoriesImage", maxCount: 3 }]),
      accessoriesImageUpload
    );

  router
    .route("/")
    .get(getAllProduct) // Uncomment if needed
    .post(photoUpload.single("image"), createPoduct);

  router
    .route("/:id")
    .get(validId,getProductById)
    .put(photoUpload.single("image"), updateProduct)
    .delete(verifyAdmin, deleteProduct);

  router.route("/").get(getProductByFilter);

  module.exports = router;
