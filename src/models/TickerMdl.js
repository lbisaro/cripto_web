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

module.exports = mongoose.model('Ticker',TickerSchema);
