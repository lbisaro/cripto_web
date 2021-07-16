const moment = require('moment');
const express = require('express');
const router = express.Router();

const Ticker = require('../models/TickerMdl');

router.get('/', async (req,res) => {
    const tickersToSend = [];
    let lastUpdate = '';
    const tickers = await Ticker.find().sort({perc_1m: "desc"}).lean()
    for (let i=0; i<tickers.length; i++) {
        if (tickers[i].updated>lastUpdate)
            lastUpdate = tickers[i].updated;
        if (tickers[i].perc_1m > 0 || tickers[i].perc_5m > 0 || tickers[i].perc_15m > 0 || tickers[i].perc_1h > 0)
        {
            tickers[i].name = tickers[i]._id.replace('USDT','');

            //Suma el incremento en porcentaje sobre los ultimos 15 registros de 1 minuto
            //Ref =((ultimo/anterior)-1)*100
            let sumLast15m = 0;
            if (tickers[i].prices_1m.length>16){
                for (let j=(tickers[i].prices_1m.length-15); j<tickers[i].prices_1m.length;j++){
                    perc = ((tickers[i].prices_1m[j].price / tickers[i].prices_1m[j-1].price)-1)*100;
                    sumLast15m += perc;
                }
            }
            tickers[i].sumLast15m = sumLast15m.toFixed(2);
        }
    };
    lastUpdate = lastUpdate.toString();
    lastUpdate = lastUpdate.substr(6,2)+'-'+lastUpdate.substr(4,2)+'-'+lastUpdate.substr(0,4)+' '+lastUpdate.substr(8,2)+':'+lastUpdate.substr(10,2)
    res.render('index',{tickers,lastUpdate});
});

module.exports = router;