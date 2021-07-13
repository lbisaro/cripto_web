var moment = require('moment'); 
const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogSchema = new Schema({
    _id: String
});

LogSchema.statics.getDocId = function() { 
    const docId = moment().format('YYYYMMDD');
    return docId; 
};

LogSchema.statics.getLogTime = function() { 
    const logTime = moment().format('HHmmss');
    return logTime; 
};

LogSchema.statics.compareLast = function(toCompare) {
    const diffLast = moment(toCompare, "YYYYMMDDHHmmss").fromNow();
    return diffLast;
}

module.exports = mongoose.model('Log',LogSchema);
