const express = require("express");
const router = express.Router();

const {
  getreviewCount,
  getAllReviews,
  deleteReview,
  createReview,
  updateReview
} = require("../Controller/reviewController");

const { verifyToken,verifyUser, verifyAuthorization } = require("../middlewares/verifyToken");

router.get("/", getAllReviews);

router.post("/", verifyToken, createReview);

router.get("/count", getreviewCount);

router.put("/:id", verifyAuthorization, updateReview);

router.delete("/:id", verifyAuthorization, deleteReview);

module.exports = router; 
