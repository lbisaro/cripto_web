const moment = require('moment');
const express = require('express');
const router = express.Router();

const Tiker = require('../models/TikerMdl');

router.get('/', async (req,res) => {
    const tikersToSend = [];
    let lastUpdate = '';
    const tikers = await Tiker.find().sort({perc_1m: "desc"}).lean()
    for (let i=0; i<tikers.length; i++) {
        if (tikers[i].updated>lastUpdate)
            lastUpdate = tikers[i].updated;
        if (tikers[i].perc_1m > 0 && tikers[i].perc_5m > 0 && tikers[i].perc_15m > 0)
        {
            tikers[i].name = tikers[i]._id.replace('USDT','');

            //Suma el incremento en porcentaje sobre los ultimos 15 registros de 1 minuto
            //Ref =((ultimo/anterior)-1)*100
            let sumLast15m = 0;
            if (tikers[i].prices_1m.length>16){
                for (let j=(tikers[i].prices_1m.length-15); j<tikers[i].prices_1m.length;j++){
                    perc = ((tikers[i].prices_1m[j].price / tikers[i].prices_1m[j-1].price)-1)*100;
                    sumLast15m += perc;
                    

                }
            }
            tikers[i].sumLast15m = sumLast15m.toFixed(2);
        }
    };
    lastUpdate = lastUpdate.toString();
    lastUpdate = lastUpdate.substr(6,2)+'-'+lastUpdate.substr(4,2)+'-'+lastUpdate.substr(0,4)+' '+lastUpdate.substr(8,2)+':'+lastUpdate.substr(10,2)
    res.render('index',{tikers,lastUpdate});
});


module.exports = router;