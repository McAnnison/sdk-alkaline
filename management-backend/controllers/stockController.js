const Stock = require('../models/Stock');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).fields([
  { name: 'labelsLeftImage', maxCount: 1 },
  { name: 'shrinkWrapImage', maxCount: 1 }
]);

// Handle stock data submission
exports.createStock = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      const { 
        openingStock, 
        todaysProduction, 
        totalInStock, 
        dispatch, 
        closingStock, 
        waterLevel 
      } = req.body;
      
      const stockData = {
        openingStock,
        todaysProduction,
        totalInStock,
        dispatch,
        closingStock,
        waterLevel,
        recordedBy: req.userId
      };
      
      // Add image paths if files were uploaded
      if (req.files.labelsLeftImage) {
        stockData.labelsLeftImage = req.files.labelsLeftImage[0].path;
      }
      if (req.files.shrinkWrapImage) {
        stockData.shrinkWrapImage = req.files.shrinkWrapImage[0].path;
      }
      
      const stock = new Stock(stockData);
      await stock.save();
      
      res.status(201).json(stock);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Get all stock records
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('recordedBy', 'username');
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get stock records by date range
exports.getStocksByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stocks = await Stock.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('recordedBy', 'username');
    
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};