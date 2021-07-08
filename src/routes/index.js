const express = require('express');
const router = express.Router();

const Tiker = require('../models/TikerMdl');

router.get('/', async (req,res) => {
    const tikers = await Tiker.find().sort({perc_1m: "desc"}).lean();
    res.render('index',{tikers});
});


module.exports = router;