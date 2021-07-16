const moment = require('moment');
const express = require('express');
const router = express.Router();

const Ticker = require('../models/TickerMdl');

router.get('/', async (req,res) => {
    let lastUpdate = '';
    const tickerPrices = await Ticker.getPrices();
    res.render('index',tickerPrices);
});

module.exports = router;