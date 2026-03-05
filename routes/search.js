// routes/search.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search');

// Simple search route
router.get('/search', searchController.simpleSearch);

module.exports = router;