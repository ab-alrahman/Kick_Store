const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser, validateLoginUser } = require("../Models/User");
const { cloudinaryUploadImage, cloudinaryRemoveImage, cloudinaryUploudImage } = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const generateToken = require("../utils/token");

/**
 * @desc Register New User
 * @route /api/auth/register
 * @method POST
 * @access Public
 */
module.exports.register = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "This user is already registered" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    let result;
    try {
      result = await cloudinaryUploudImage(imagePath);
    } catch (uploadError) {
      fs.unlinkSync(imagePath);
      return res.status(500).json({ message: "Image upload failed" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      isAdmin: req.body.isAdmin || false,
      phone: req.body.phone,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    await user.save();

    fs.unlinkSync(imagePath);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      phone: user.phone,
      image: user.image,
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @desc Login User
 * @route /api/auth/login
 * @method POST
 * @access Public
 */
module.exports.login = asyncHandler(async (req, res) => {
  try {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
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

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});