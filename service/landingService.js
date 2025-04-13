// services/landing.service.js
const {Product} = require('../Models/Product');
const {Review} = require('../Models/Review');

module.exports = {
  getFeaturedProducts: async () => {
    return await Product.find({ isFeatured: true }).limit(5);
  },
  
  getTestimonials: async () => {
    return await Review.find({ approved: true });
  },
  
  getTeamMembers: async () => {
    return [
      { name: 'Ahmed', position: 'Web Developer' },
      { name: 'Mohamed', position: 'Designer' }
    ];
  }
};