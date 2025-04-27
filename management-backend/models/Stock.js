const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  openingStock: {
    type: Number,
    required: true
  },
  todaysProduction: {
    type: Number,
    required: true
  },
  totalInStock: {
    type: Number,
    required: true
  },
  dispatch: {
    type: Number,
    required: true
  },
  closingStock: {
    type: Number,
    required: true
  },
  waterLevel: {
    type: Number,
    required: true
  },
  labelsLeftImage: {
    type: String
  },
  shrinkWrapImage: {
    type: String
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stock', stockSchema);