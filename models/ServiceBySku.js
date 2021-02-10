const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceBySku = new Schema({
  skuId: String,
  serviceSkuId: String,
  zipCodeStart: Number,
  zipCodeEnd: Number,
  createdAt: { type: Date, default: Date.now },
});

mongoose.model('ServiceBySku', serviceBySku);

module.exports = mongoose.model('ServiceBySku');
