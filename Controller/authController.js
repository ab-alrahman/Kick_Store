const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../Models/User");
const {
  cloudinaryUploudImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const generateToken = require("../utils/token");

/**
 * @desc Register New User
 * @route /api/product/register
 * @method POST
 * @access Public
 */

module.exports.register = asyncHandler(async (req, res) => {

    if (!req.file) {
      res.status(404).json({ message: "no image provided" });
  }
  
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message }); 
  }
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploudImage(imagePath);

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "This user is already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    isAdmin: req.body.isAdmin || false,
    phone: req.body.phone, 
    image: {
      url: result.secure_url,
      publicId: result.public_id,
  } || null,
  });
  await user.save();

  res.status(201).json({
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
    phone: req.body.phone,
    image: user.image,
  });
    fs.unlinkSync(imagePath);
});

/**
 * @desc Login User
 * @route /api/product/login
 * @method POST
 * @access Public
 */
module.exports.login = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user);
  res.status(200).json({
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
    token,
  });
});
