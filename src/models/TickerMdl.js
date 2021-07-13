var moment = require('moment'); 
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TickerSchema = new Schema({
    _id: String
});

module.exports = mongoose.model('Ticker',TickerSchema);
