var moment = require('moment'); 
const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({
    _id: String
});

module.exports = mongoose.model('Log',LogSchema);
