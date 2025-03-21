const asyncHandler = require("express-async-handler");
const { User } = require("../Models/User")
const { Product } = require("../Models/Product");
const { validateCreateReview, Review, validateUpdateReview } = require("../Models/Review");

/**
 * @desc Create New Review
 * @route /api/review
 * @method POST
 * @access private (only user)
 */

module.exports.createReview = asyncHandler(async (req, res) => {
  const {error } = validateCreateReview(req.body)
  if(error) {
    return res.status(400).json({message : error.details[0].message})
  }
  const product = await Product.findById(req.body.product)
  const user = await User.findById(req.user.id)

  const review = new Review({
    productId: product.id,
    userId: user.id,
    rating: req.body.rating,
    comment: req.body.comment,
  })
  res.status(201).json(review);
})

/**
 * @desc Get All Reviews
 * @route /api/review
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllReviews= asyncHandler(async(req,res) =>{
    const review = await Review.find().populate("userId" ,"name email")
  res.status(200).json(review);
})

/**
 * @desc Update Review
 * @route /api/review/:id
 * @method PUT
 * @access private (only user)
 */

module.exports.updateReview = asyncHandler(async (req, res) => {
  const { error } = validateUpdateReview(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
  }
  const updatedreview = await Review.findByIdAndUpdate(req.params.id , {
    $set : {
    comment : req.body.comment,
    rating : req.body.rating
    }
},{new:true});
res.status(200).json(updatedreview);
},{new : true})


/**
 * @desc Delete Review
 * @route /api/review/:id
 * @method DELETE
 * @access private (only user)
 */
module.exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  await Review.findByIdAndDelete(req.params.id);
  const user = await User.findById(req.user.id)
  res.status(200).json({
    message: "Review has been deleted successfully",
    userId: user._id
});
})

/**
 * @desc Get Review Count 
 * @route /api/review/count
 * @method GET
 * @access private (only admim)
 */
module.exports.getreviewCount =asyncHandler(async(req ,res) =>{
    const count = await Review.countDocuments()
    res.status(200).json(count)
    
})
