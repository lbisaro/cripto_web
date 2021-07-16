const moment = require('moment');
const express = require('express');
const router = express.Router();

const Ticker = require('../models/TickerMdl');

router.get('/', async (req,res) => {
    res.render('index',{});
});

module.exports = router;