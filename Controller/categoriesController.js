const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../Models/Category");
const {
  cloudinaryUploudImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

/**
 * @desc Create New Category
 * @route /api/categories
 * @method POST
 * @access private (only admin)
 */
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(404).json({ message: "no image provided" });
  }
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3. Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploudImage(imagePath);
  const category = await Category.create({
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    name: req.body.name,
  });
  res.status(201).json(category);
  // 6. Remove image frome server
  fs.unlinkSync(imagePath);
});

/**
 * @desc Get All Categories with Pagination and Limit
 * @route /api/categories
 * @method GET
 * @access public
 */
module.exports.getAllCategoryCtrl = asyncHandler(async (req, res) => {
  const CATEGORIES_PER_PAGE = parseInt(req.query.limit) || 10; // عدد الفئات في كل صفحة (قيمة افتراضية 10)
  const pageNumber = parseInt(req.query.page) || 1; // الصفحة الحالية من طلب الاستعلام
  const skip = (pageNumber - 1) * CATEGORIES_PER_PAGE; // العناصر التي يجب تخطيها

  // الحصول على العدد الإجمالي للفئات
  const totalCategories = await Category.countDocuments();
  const totalPages = Math.ceil(totalCategories / CATEGORIES_PER_PAGE);

  // استرجاع الفئات مع تطبيق التقسيم إلى صفحات وتحديد العدد المطلوب
  const categories = await Category.find()
    .skip(skip)
    .limit(CATEGORIES_PER_PAGE);

  res.status(200).json({
    categories,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalCategories,
      categoriesPerPage: CATEGORIES_PER_PAGE,
    },
  });
});

/**
 * @desc Delete Category
 * @route /api/categories/:id
 * @method DELETE
 * @access private (only admin)
 */
module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ message: "Category not found" });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "category has been deleted successfully",
    categoryId: category._id,
  });
});
