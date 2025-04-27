const express = require('express');
const router = express.Router();
const stockController = require('./controllers/stockController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   POST api/stock
// @desc    Create new stock record
// @access  Private
router.post('/', authenticate, stockController.createStock);

// @route   GET api/stock
// @desc    Get all stock records
// @access  Private (Admin only)
router.get('/', authenticate, authorize(['admin']), stockController.getAllStocks);

// @route   GET api/stock/range
// @desc    Get stock records by date range
// @access  Private (Admin only)
router.get('/range', authenticate, authorize(['admin']), stockController.getStocksByDateRange);

module.exports = router;