
class TickerCtrl {
    static async updatePrices(prices) { 
        const Tiker = require('../models/TikerMdl');
      
        //Obteniendo Fecha y hora del update para los precios
        let dateToTicker = await Tiker.getTickerDateTime();
        let updMin = dateToTicker.substr(-2);

        //Registrando los precios obtenidos
        let tickersId = Object.keys(prices);
        let q=0;
        for(let i=0; i< tickersId.length; i++){
          let tickerId = tickersId[i];

          //Update Tiker -------------------------------------------------------------------------
          if (tickerId.substr(-4)=='USDT' && tickerId.substr(-8)!='DOWNUSDT' && tickerId.substr(-6)!='UPUSDT' ) {
            console.log('1',tickerId);
            let ticker = await Tiker.findById(tickerId);
            console.log('2',tickerId);
            if (!ticker) 
            {
              console.log('2');
              ticker = await new Tiker({_id: tickerId, 
                created: dateToTicker
               });
               console.log('3');

            }
            prices[tickerId] = Number(prices[tickerId]).toString(); //Quita los 0 de mas en los decimales
            console.log('4');

            //Averiguando la cantidad de decimales de la moneda -------------------------------------------------------------------------
            var tickerDecs = (prices[tickerId].split('.')[1]?prices[tickerId].split('.')[1].length:1);
            
            ticker.updated = dateToTicker;
            ticker.price = prices[tickerId];
            ticker.prices_1m.push({dt: dateToTicker, price: prices[tickerId]});
            if (updMin.substr(-1) == '0' || updMin.substr(-1) == '5') {  
              ticker.prices_5m.push({dt: dateToTicker, price: prices[tickerId]});
            }
            if (updMin == '00' || updMin == '15' || updMin == '30' || updMin == '45') {
              ticker.prices_15m.push({dt: dateToTicker, price: prices[tickerId]});
            }
            if (updMin == '00' ) {
              ticker.prices_1h.push({dt: dateToTicker, price: prices[tickerId]});
            }
            
          
            //Calcular indicadores -------------------------------------------------------------------------
            let ind_val = 0;
            let j=0;
            let reviewStart=0;
            let period=0;

            //MA 200 (Solo para 1 hora)-------------------------------------------------------------------------
            //https://runkit.com/anandaravindan/sma
            const SMA = require('technicalindicators').SMA
 
            period = 200;
            if (ticker.prices_1h.length >= period) {
              reviewStart = ticker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1h[j].price);
              }
              ind_val = SMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_1h[(ticker.prices_1h.length-1)].ind_ma200 = ind_val;
            }

            //EMA 7 y 14 ---------------------------------------------------------------------------------------
            //https://runkit.com/anandaravindan/ema
            const EMA = require('technicalindicators').EMA; 

            period = 7;
            if (ticker.prices_1m.length >= period) {
              reviewStart = ticker.prices_1m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_1m[(ticker.prices_1m.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (ticker.prices_1m.length >= period) {
              reviewStart = ticker.prices_1m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_1m[(ticker.prices_1m.length-1)].ind_ema14 = ind_val;
            }

            
            period = 7;
            if (ticker.prices_5m.length >= period) {
              reviewStart = ticker.prices_5m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_5m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_5m[(ticker.prices_5m.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (ticker.prices_5m.length >= period) {
              reviewStart = ticker.prices_5m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_5m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_5m[(ticker.prices_5m.length-1)].ind_ema14 = ind_val;
            }

            period = 7;
            if (ticker.prices_15m.length >= period) {
              reviewStart = ticker.prices_15m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_15m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_15m[(ticker.prices_15m.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (ticker.prices_15m.length >= period) {
              reviewStart = ticker.prices_15m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_15m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_15m[(ticker.prices_15m.length-1)].ind_ema14 = ind_val;
            }

            period = 7;
            if (ticker.prices_1h.length >= period) {
              reviewStart = ticker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1h[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_1h[(ticker.prices_1h.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (ticker.prices_1h.length >= period) {
              reviewStart = ticker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1h[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tickerDecs);
              ticker.prices_1h[(ticker.prices_1h.length-1)].ind_ema14 = ind_val;
            }
            
            //BOLLINGER (20,2) ---------------------------------------------------------------------------------
            const BB = require('technicalindicators').BollingerBands; //https://runkit.com/anandaravindan/bb

            period = 20;

            if (ticker.prices_1m.length >= period) {
              reviewStart = ticker.prices_1m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1m[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              ticker.prices_1m[(ticker.prices_1m.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tickerDecs);
              ticker.prices_1m[(ticker.prices_1m.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tickerDecs);
              ticker.prices_1m[(ticker.prices_1m.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tickerDecs);
            }

            if (ticker.prices_5m.length >= period) {
              reviewStart = ticker.prices_5m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_5m[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              ticker.prices_5m[(ticker.prices_5m.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tickerDecs);
              ticker.prices_5m[(ticker.prices_5m.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tickerDecs);
              ticker.prices_5m[(ticker.prices_5m.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tickerDecs);
            }

            if (ticker.prices_15m.length >= period) {
              reviewStart = ticker.prices_15m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_15m[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              ticker.prices_15m[(ticker.prices_15m.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tickerDecs);
              ticker.prices_15m[(ticker.prices_15m.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tickerDecs);
              ticker.prices_15m[(ticker.prices_15m.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tickerDecs);
            }

            if (ticker.prices_1h.length >= period) {
              reviewStart = ticker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(ticker.prices_1h[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              ticker.prices_1h[(ticker.prices_1h.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tickerDecs);
              ticker.prices_1h[(ticker.prices_1h.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tickerDecs);
              ticker.prices_1h[(ticker.prices_1h.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tickerDecs);
              
            }

            //Eliminar prices(1m, 5m, 15m y 1h) anteriores a 200 periodos
            while (ticker.prices_1m.length>200) {
              ticker.prices_1m.shift();
            }
            while (ticker.prices_5m.length>200) {
              ticker.prices_5m.shift();
            }
            while (ticker.prices_15m.length>200) {
              ticker.prices_15m.shift();
            }
            while (ticker.prices_1h.length>200) {
              ticker.prices_1h.shift();
            }

            //Actualizando porcentajes
            //Ref =((ultimo/anterior)-1)*100

            //Cambio respecto al periodo anteriores
            if (ticker.prices_1m.length>1)
              ticker.perc_1m =  ( ( ( ticker.prices_1m[ticker.prices_1m.length-1].price   / ticker.prices_1m[ticker.prices_1m.length-2].price   ) -1 ) * 100 ).toFixed(2);
            if (ticker.prices_1m.length>3)
              ticker.perc_3m =  ( ( ( ticker.prices_1m[ticker.prices_1m.length-1].price   / ticker.prices_1m[ticker.prices_1m.length-4].price   ) -1 ) * 100 ).toFixed(2);
            if (ticker.prices_5m.length>1)
              ticker.perc_5m =  ( ( ( ticker.prices_5m[ticker.prices_5m.length-1].price   / ticker.prices_5m[ticker.prices_5m.length-2].price   ) -1 ) * 100 ).toFixed(2);
            if (ticker.prices_15m.length>1)
              ticker.perc_15m = ( ( ( ticker.prices_15m[ticker.prices_15m.length-1].price / ticker.prices_15m[ticker.prices_15m.length-2].price ) -1 ) * 100 ).toFixed(2);
            if (ticker.prices_1h.length>1)
              ticker.perc_1h =  ( ( ( ticker.prices_1h[ticker.prices_1h.length-1].price   / ticker.prices_1h[ticker.prices_1h.length-2].price   ) -1 ) * 100 ).toFixed(2);

            //Precio actual respecto a la ma200
            if (ticker.prices_1h.length>0 && ticker.prices_1h[(ticker.prices_1h.length-1)].ind_ma200)
              ticker.perc_price_vs_ma200 = ( ( ( ticker.prices_1h[(ticker.prices_1h.length-1)].ind_ma200   / ticker.price   ) -1 ) * 100 ).toFixed(2);
 
            await ticker.save();    
            q++;      
          }
      }
      return {dateToTicker: dateToTicker,
              tickersUpdated: q
            };
   };
}

module.exports = { TickerCtrl };