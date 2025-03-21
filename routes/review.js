const express = require("express");
const router = express.Router();

const {
  getreviewCount,
  getAllReviews,
  deleteReview,
  createReview,
  updateReview
} = require("../Controller/reviewController");

const { verifyUser, verifyAuthorization } = require("../middlewares/verifyToken");

router.get("/", getAllReviews);

router.post("/", verifyUser, createReview);

router.get("/count", getreviewCount);

router.put("/:id", verifyAuthorization, updateReview);

router.delete("/:id", verifyAuthorization, deleteReview);

module.exports = router;
