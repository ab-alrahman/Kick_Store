  const express = require("express");
  const router = express.Router();

const { getreviewCount, getAllReviews, deleteReview, createReview, updateReview } = require("../Controller/reviewController");

router.route("/").get(getAllReviews).post(createReview);
router.route("/:id").put(updateReview).delete(deleteReview)
router.route("/count").get(getreviewCount)


module.exports = router;
