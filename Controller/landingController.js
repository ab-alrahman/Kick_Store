
const express = require('express');
const router = express.Router();
const landingService = require('../service/landingService');

router.get('/', async (req, res) => {
  try {
    const featuredProducts = await landingService.getFeaturedProducts();
    const testimonials = await landingService.getTestimonials();
    
    res.render('index', {
      featuredProducts,
      testimonials,
      metaTitle: 'Homepage'
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading homepage' });
  }
});

router.get('/about', async (req, res) => {
  try {
    const teamMembers = await landingService.getTeamMembers();
    res.render('about', {
      teamMembers,
      metaTitle: 'About Us'
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading about page' });
  }
});

module.exports = router;