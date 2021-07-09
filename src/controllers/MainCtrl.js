const Binance = require('node-binance-api');

class MainCtrl {
    static async getPrices() {
        
        /*
            Video sobre variables de entorno para proteger datos confidenciales en el codigo
            https://www.youtube.com/watch?v=U6st9-lNUyY
        */
        const binance = new Binance().options(/*{
        APIKEY: '<key>',
        APISECRET: '<secret>'
        }*/);
        const TickerCtrl = require("./TickerCtrl").TickerCtrl;

        let prices = await binance.prices();
        let q = await TickerCtrl.updatePrices(prices);
        console.log('Prices updated: ',q);
        
        
    }
}
module.exports = { MainCtrl };
