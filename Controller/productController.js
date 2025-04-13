const asyncHandler = require("express-async-handler");
const {
  Product,
  validateCreateProduct,
  validateUpdateProduct,
} = require("../Models/Product");
const {
  cloudinaryUploudImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

/**
 * @desc Get all products with pagination
 * @route /api/product
 * @method GET
 * @access public
 */
module.exports.getAllProduct = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = parseInt(req.query.limit) || 12; 
  const pageNumber = parseInt(req.query.page) || 1; 
  skip = (pageNumber - 1) * POST_PER_PAGE;

  const totalProducts = await Product.countDocuments();
  const totalPages = Math.ceil(totalProducts / POST_PER_PAGE);

  const products = await Product.find().skip(skip).limit(POST_PER_PAGE);

  res.status(200).json({
    products,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      productsPerPage: POST_PER_PAGE,
    },
  });
});

/**
 * @desc get product by id
 * @route /api/product/:id
 * @method GET
 * @access public
 */
module.exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "product not found" });
  }
});

/**
 * @desc get product by filter
 * @route /api/product
 * @method GET
 * @access public
 */
module.exports.getProductByFilter = asyncHandler(async (req, res) => {
  const { category, limit, page, color, size, price } = req.query;

  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (color) {
    filter.color = color;
  }
  if (size) {
    filter.size = size;
  }
  if (price) {
    filter.salePrice = {
      $lte: price,
    };
  }

  const POST_PER_PAGE = parseInt(limit) || 12; // Number of products per page
  const pageNumber = parseInt(page) || 1; // Current page number
  const skip = (pageNumber - 1) * POST_PER_PAGE;

  // Calculate the total filtered product count
  const totalProducts = await Product.countDocuments(filter);

  // Calculate total pages based on filtered product count
  const totalPages = Math.ceil(totalProducts / POST_PER_PAGE);

  // Retrieve the filtered products with pagination
  const products = await Product.find(filter).skip(skip).limit(POST_PER_PAGE);

  res.status(200).json({
    products,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalProducts,
      productsPerPage: POST_PER_PAGE,
    },
  });
});

/**
 * @desc Create new product
 * @route /api/product
 * @method POST
 * @access public
 */

module.exports.createPoduct = asyncHandler(async (req, res) => {
  // 1. Validation for Image
  if (!req.file) {
    res.status(404).json({ message: "no image provided" });
  }
  // 2. Validation for data
  const { error } = validateCreateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3. Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploudImage(imagePath);
  // 4. Create new post and save it to DB
  const product = await Product.create({
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    brandName: req.body.brandName,
    regularPrice: req.body.regularPrice,
    salePrice: req.body.salePrice,
    stockQuantity: req.body.stockQuantity,
    SKU: req.body.SKU,
    size: req.body.size,
    color: req.body.color,
  });
  // 5. Send response to the Client
  res.status(201).json(product);
  // 6. Remove image frome server
  fs.unlinkSync(imagePath);
});

/**
 * @desc update a product
 * @route /api/product/:id
 * @method PUT
 * @access public
 */
module.exports.updateProduct = asyncHandler(async (req, res) => {
  const { error } = validateUpdateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let updatedFields = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    brandName: req.body.brandName,
    regularPrice: req.body.regularPrice,
    salePrice: req.body.salePrice,
    stockQuantity: req.body.stockQuantity,
    SKU: req.body.SKU,
    size: req.body.size, 
    color: req.body.color,
  };

  if (req.file) {
    console.log("Image file found:", req.file); // تحقق مما إذا كانت الصورة موجودة

    // Delete Old Image from Cloudinary
    await cloudinaryRemoveImage(product.image.publicId);

    // Upload new image to Cloudinary
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploudImage(imagePath);

    updatedFields.image = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    // Remove image from local server
    fs.unlinkSync(imagePath);
  } else {
    console.log("No image file provided"); // إذا لم يتم تقديم صورة جديدة
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: updatedFields,
    },
    { new: true }
  );

  res.status(200).json(updatedProduct);
});

/**
 * @desc delete a product
 * @route /api/product/:id
 * @method DELETE
 * @access public
 */
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "product has been deleted" });
  } else {
    res.status(404).json({ message: "product not found" });
  }
});

/**
 * @desc Accessories Image UPload
 * @route /api/product/accessories-image-upload
 * @method POST
 * @access private (only admin)
 */

module.exports.accessoriesImageUpload = asyncHandler(async (req, res) => {
  // تحقق من وجود ملفات الملحقات
  if (
    !req.files ||
    !req.files["accessoriesImage"] ||
    !Array.isArray(req.files["accessoriesImage"])
  ) {
    return res.status(400).json({ message: "No files provided" });
  }

  // استرجع المنتج بناءً على ID
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // إزالة الصور القديمة
  for (const accessoryImage of product.accessoriesImage) {
    if (accessoryImage.publicId) {
      await cloudinaryRemoveImage(accessoryImage.publicId);
    }
  }

  // إعادة تعيين الصور إلى مصفوفة فارغة
  product.accessoriesImage = [];

  // رفع الصور الجديدة
  for (const file of req.files["accessoriesImage"]) {
    const imagePath = path.join(__dirname, `../images/${file.filename}`);

    const result = await cloudinaryUploudImage(imagePath);

    // إضافة الصورة الجديدة إلى accessoriesImage
    product.accessoriesImage.push({
      url: result.secure_url,
      publicId: result.public_id,
    });

    // إزالة الصورة من النظام المحلي
    fs.unlinkSync(imagePath);
  }

  // حفظ المنتج بعد الانتهاء من معالجة جميع الصور
  await product.save();

  // إرسال الاستجابة إلى العميل
  res.status(200).json({
    message: "Accessories images uploaded successfully",
    accessoriesImage: product.accessoriesImage,
  });
});
/**
 * @desc Get all unique colors and sizes from products
 * @route /api/product/colors-sizes
 * @method GET
 * @access public
 */
module.exports.getAllColorsAndSizes = asyncHandler(async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $project: {
          colors: {
            $cond: {
              if: { $isArray: "$color" },
              then: "$color",
              else: ["$color"], // Wrap single value in an array
            },
          },
          sizes: {
            $cond: {
              if: { $isArray: "$size" },
              then: "$size",
              else: ["$size"], // Wrap single value in an array
            },
          },
        },
      },
      {
        $unwind: "$colors", // Flatten colors array
      },
      {
        $unwind: "$sizes", // Flatten sizes array
      },
      {
        $group: {
          _id: null,
          allColors: {
            $addToSet: { $toLower: { $trim: { input: "$colors" } } },
          },
          allSizes: { $addToSet: { $toLower: { $trim: { input: "$sizes" } } } },
        },
      },
      {
        $project: {
          _id: 0,
          colors: "$allColors",
          sizes: "$allSizes",
        },
      },
    ]);

    if (result && result.length > 0) {
      const { colors, sizes } = result[0];
      res.status(200).json({ colors, sizes });
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching colors and sizes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
