// services/listing.service.js
const {Product} = require('../Models/Product');

module.exports = {
  getProducts: async ({ page, limit, category }) => {
    const query = {};
    if (category) {
      query.category = category;
    }
    
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    
    return { products, total };
  }
};