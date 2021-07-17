var moment = require('moment'); 
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TickerSchema = new Schema({
    _id: String
});

TickerSchema.statics.getPrices = async function () {
    let lastUpdate = '';
    const tkrs = await this.find().sort({perc_1m: "desc"}).lean();
    let tickers = [];
    for (let i=0; i<tkrs.length; i++) {
        if (tkrs[i].updated>lastUpdate)
            lastUpdate = tkrs[i].updated;
        if (tkrs[i].perc_1m > 0 || tkrs[i].perc_5m > 0 || tkrs[i].perc_15m > 0 || tkrs[i].perc_1h > 0)
        {
            tkrs[i].name = tkrs[i]._id.replace('USDT','');

            //Suma el incremento en porcentaje sobre los ultimos 15 registros de 1 minuto
            //Ref =((ultimo/anterior)-1)*100
            let sumLast15m = 0;
            if (tkrs[i].prices_1m.length>16){
                for (let j=(tkrs[i].prices_1m.length-15); j<tkrs[i].prices_1m.length;j++){
                    perc = ((tkrs[i].prices_1m[j].price / tkrs[i].prices_1m[j-1].price)-1)*100;
                    sumLast15m += perc;
                }
            }
            tkrs[i].sumLast15m = sumLast15m.toFixed(2);
            tickers.push(tkrs[i]);
        }
    };
    lastUpdate = lastUpdate.toString();
    lastUpdate = lastUpdate.substr(6,2)+'-'+lastUpdate.substr(4,2)+'-'+lastUpdate.substr(0,4)+' '+lastUpdate.substr(8,2)+':'+lastUpdate.substr(10,2)
    return {tickers,lastUpdate};
};

/**
 * 
 * @param {*} tickerId: BTCUSDT, ETHUSDT, etc.....
 * @param {*} period: 1m, 5m, 15m, 1h
 * @returns 
 */

TickerSchema.statics.getTickerPrices = async function (tickerId, period) {
    if (period!='1m' && period!='5m' && period!='15m' && period!='1h')
        period = '1m';

    const ticker = await this.findOne({_id: tickerId}).lean();
    
    let prices = []; 
    if (period == '1m')
        prices = ticker.prices_1m;
    else if (period == '5m')
        prices = ticker.prices_5m;
    else if (period == '15m')
        prices = ticker.prices_15m;
    else if (period == '1h')
        prices = ticker.prices_1h;

    let data = [];
    let date;
    for (let i=0; i<prices.length; i++) {
        date = new Date(moment(prices[i].dt.toString().substr(0,8)+' '+prices[i].dt.toString().substr(8,4)+'00').format());
        data.push({date: date,
                   prices: prices[i].price
                 })  
    }
    return {data};
};

module.exports = mongoose.model('Ticker',TickerSchema);
