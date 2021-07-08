var moment = require('moment'); 
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TikerSchema = new Schema({
    _id: String,
    created: Number,
    updated: Number,
    price: Number,
    perc_1m: Number,
    perc_5m: Number,
    perc_15m: Number,
    perc_1h: Number,
    perc_price_vs_ma200: Number,
    prices_1m:  [{_id : false, 
                  dt: Number , 
                  price: Number,
                  ind_ema7: Number,
                  ind_ema14: Number,
                  ind_bb_u: Number,
                  ind_bb_m: Number,
                  ind_bb_l: Number
                }],
    prices_5m:  [{_id : false, 
                  dt: Number , 
                  price: Number,
                  ind_ema7: Number,
                  ind_ema14: Number,
                  ind_bb_u: Number,
                  ind_bb_m: Number,
                  ind_bb_l: Number
                }],
    prices_15m: [{_id : false, 
                  dt: Number , 
                  price: Number,
                  ind_ema7: Number,
                  ind_ema14: Number,
                  ind_bb_u: Number,
                  ind_bb_m: Number,
                  ind_bb_l: Number
                }],
    prices_1h:  [{_id : false, 
                  dt: Number , 
                  price: Number,
                  ind_ma200: Number,
                  ind_ema7: Number,
                  ind_ema14: Number,
                  ind_bb_u: Number,
                  ind_bb_m: Number,
                  ind_bb_l: Number
                }],
});

TikerSchema.statics.getTickerDateTime = function() { 
    //Definiendo el ID (Relacionado al momento en que se obtienen los precios)
    const dateToIdForPrice = moment().format('YYYYMMDDHHmm');
    return dateToIdForPrice; 
};

module.exports = mongoose.model('Tiker',TikerSchema);
