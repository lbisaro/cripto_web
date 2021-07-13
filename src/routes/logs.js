const moment = require('moment');
const express = require('express');
const router = express.Router();

const Log = require('../models/LogMdl');

router.get('/logs', async (req,res) => {
    const logs = await Log.find().sort({_id: "desc"}).limit(1).lean();
    let data = [];
    for (let i=0; i<logs.length; i++){
        for (j=0; j<logs[i].daily.length;j++){
            data.unshift({  dt : moment(logs[i]._id).format('DD-MM-YY'),
                            start: moment(logs[i]._id+' '+logs[i].daily[j].start).format('HH:mm:ss'),
                            end: moment(logs[i]._id+' '+logs[i].daily[j].end).format('HH:mm:ss'),
                            diffLast: logs[i].daily[j].diffLast,
                            memory: logs[i].daily[j].memory,
                            tickersUpdated: logs[i].daily[j].tickersUpdated
                    });
            
        }
    }
res.render('logs',{data});
});


module.exports = router;