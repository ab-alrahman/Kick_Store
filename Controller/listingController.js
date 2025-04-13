
const express = require('express');
const router = express.Router();
const listingService = require('../service/listingService');

router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    
    const { products, total } = await listingService.getProducts({
      page,
      limit,
      category
    });

    res.render('products/listing', {
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      category,
      metaTitle: 'Products Listing'
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading products' }); 
  }
});

module.exports = router;