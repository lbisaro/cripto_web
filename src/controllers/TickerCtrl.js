
class TickerCtrl {
    static async updatePrices(prices) { 
        const Tiker = require('../models/TikerMdl');
      
        //Obteniendo Fecha y hora del update para los precios
        let dateToTicker = await Tiker.getTickerDateTime();
        let updMin = dateToTicker.substr(-2);

        //Registrando los precios obtenidos
        let tikersId = Object.keys(prices);
        let q=0;
        for(let i=0; i< tikersId.length; i++){
          let tikerId = tikersId[i];

          //Update Tiker -------------------------------------------------------------------------
          if (tikerId.substr(-4)=='USDT' && tikerId.substr(-8)!='DOWNUSDT' && tikerId.substr(-6)!='UPUSDT' ) {
            console.log('1',tikerId);
            let tiker = await Tiker.findById(tikerId);
            console.log('2',tikerId);
            if (!tiker) 
            {
              console.log('2');
              tiker = await new Tiker({_id: tikerId, 
                created: dateToTicker
               });
               console.log('3');

            }
            prices[tikerId] = Number(prices[tikerId]).toString(); //Quita los 0 de mas en los decimales
            console.log('4');

            //Averiguando la cantidad de decimales de la moneda -------------------------------------------------------------------------
            var tikerDecs = (prices[tikerId].split('.')[1]?prices[tikerId].split('.')[1].length:1);
            
            tiker.updated = dateToTicker;
            tiker.price = prices[tikerId];
            tiker.prices_1m.push({dt: dateToTicker, price: prices[tikerId]});
            if (updMin.substr(-1) == '0' || updMin.substr(-1) == '5') {  
              tiker.prices_5m.push({dt: dateToTicker, price: prices[tikerId]});
            }
            if (updMin == '00' || updMin == '15' || updMin == '30' || updMin == '45') {
              tiker.prices_15m.push({dt: dateToTicker, price: prices[tikerId]});
            }
            if (updMin == '00' ) {
              tiker.prices_1h.push({dt: dateToTicker, price: prices[tikerId]});
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
            if (tiker.prices_1h.length >= period) {
              reviewStart = tiker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1h[j].price);
              }
              ind_val = SMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_1h[(tiker.prices_1h.length-1)].ind_ma200 = ind_val;
            }

            //EMA 7 y 14 ---------------------------------------------------------------------------------------
            //https://runkit.com/anandaravindan/ema
            const EMA = require('technicalindicators').EMA; 

            period = 7;
            if (tiker.prices_1m.length >= period) {
              reviewStart = tiker.prices_1m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_1m[(tiker.prices_1m.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (tiker.prices_1m.length >= period) {
              reviewStart = tiker.prices_1m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_1m[(tiker.prices_1m.length-1)].ind_ema14 = ind_val;
            }

            
            period = 7;
            if (tiker.prices_5m.length >= period) {
              reviewStart = tiker.prices_5m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_5m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_5m[(tiker.prices_5m.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (tiker.prices_5m.length >= period) {
              reviewStart = tiker.prices_5m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_5m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_5m[(tiker.prices_5m.length-1)].ind_ema14 = ind_val;
            }

            period = 7;
            if (tiker.prices_15m.length >= period) {
              reviewStart = tiker.prices_15m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_15m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_15m[(tiker.prices_15m.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (tiker.prices_15m.length >= period) {
              reviewStart = tiker.prices_15m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_15m[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_15m[(tiker.prices_15m.length-1)].ind_ema14 = ind_val;
            }

            period = 7;
            if (tiker.prices_1h.length >= period) {
              reviewStart = tiker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1h[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_1h[(tiker.prices_1h.length-1)].ind_ema7 = ind_val;
            }

            period = 14;
            if (tiker.prices_1h.length >= period) {
              reviewStart = tiker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1h[j].price);
              }
              ind_val = EMA.calculate({period : period, values : values})[0].toFixed(tikerDecs);
              tiker.prices_1h[(tiker.prices_1h.length-1)].ind_ema14 = ind_val;
            }
            
            //BOLLINGER (20,2) ---------------------------------------------------------------------------------
            const BB = require('technicalindicators').BollingerBands; //https://runkit.com/anandaravindan/bb

            period = 20;

            if (tiker.prices_1m.length >= period) {
              reviewStart = tiker.prices_1m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1m[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              tiker.prices_1m[(tiker.prices_1m.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tikerDecs);
              tiker.prices_1m[(tiker.prices_1m.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tikerDecs);
              tiker.prices_1m[(tiker.prices_1m.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tikerDecs);
            }

            if (tiker.prices_5m.length >= period) {
              reviewStart = tiker.prices_5m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_5m[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              tiker.prices_5m[(tiker.prices_5m.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tikerDecs);
              tiker.prices_5m[(tiker.prices_5m.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tikerDecs);
              tiker.prices_5m[(tiker.prices_5m.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tikerDecs);
            }

            if (tiker.prices_15m.length >= period) {
              reviewStart = tiker.prices_15m.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_15m[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              tiker.prices_15m[(tiker.prices_15m.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tikerDecs);
              tiker.prices_15m[(tiker.prices_15m.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tikerDecs);
              tiker.prices_15m[(tiker.prices_15m.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tikerDecs);
            }

            if (tiker.prices_1h.length >= period) {
              reviewStart = tiker.prices_1h.length-period;
              let values = [];
              for (j=reviewStart; j<(reviewStart+period); j++) {
                values.push(tiker.prices_1h[j].price);
              }
              ind_val = BB.calculate({period : period, values : values, stdDev: 2});
              tiker.prices_1h[(tiker.prices_1h.length-1)].ind_bb_u = ind_val[0].upper.toFixed(tikerDecs);
              tiker.prices_1h[(tiker.prices_1h.length-1)].ind_bb_m = ind_val[0].middle.toFixed(tikerDecs);
              tiker.prices_1h[(tiker.prices_1h.length-1)].ind_bb_l = ind_val[0].lower.toFixed(tikerDecs);
              
            }

            //Eliminar prices(1m, 5m, 15m y 1h) anteriores a 200 periodos
            while (tiker.prices_1m.length>200) {
              tiker.prices_1m.shift();
            }
            while (tiker.prices_5m.length>200) {
              tiker.prices_5m.shift();
            }
            while (tiker.prices_15m.length>200) {
              tiker.prices_15m.shift();
            }
            while (tiker.prices_1h.length>200) {
              tiker.prices_1h.shift();
            }

            //Actualizando porcentajes
            //Ref =((ultimo/anterior)-1)*100

            //Cambio respecto al periodo anteriores
            if (tiker.prices_1m.length>1)
              tiker.perc_1m =  ( ( ( tiker.prices_1m[tiker.prices_1m.length-1].price   / tiker.prices_1m[tiker.prices_1m.length-2].price   ) -1 ) * 100 ).toFixed(2);
            if (tiker.prices_1m.length>3)
              tiker.perc_3m =  ( ( ( tiker.prices_1m[tiker.prices_1m.length-1].price   / tiker.prices_1m[tiker.prices_1m.length-4].price   ) -1 ) * 100 ).toFixed(2);
            if (tiker.prices_5m.length>1)
              tiker.perc_5m =  ( ( ( tiker.prices_5m[tiker.prices_5m.length-1].price   / tiker.prices_5m[tiker.prices_5m.length-2].price   ) -1 ) * 100 ).toFixed(2);
            if (tiker.prices_15m.length>1)
              tiker.perc_15m = ( ( ( tiker.prices_15m[tiker.prices_15m.length-1].price / tiker.prices_15m[tiker.prices_15m.length-2].price ) -1 ) * 100 ).toFixed(2);
            if (tiker.prices_1h.length>1)
              tiker.perc_1h =  ( ( ( tiker.prices_1h[tiker.prices_1h.length-1].price   / tiker.prices_1h[tiker.prices_1h.length-2].price   ) -1 ) * 100 ).toFixed(2);

            //Precio actual respecto a la ma200
            if (tiker.prices_1h.length>0 && tiker.prices_1h[(tiker.prices_1h.length-1)].ind_ma200)
              tiker.perc_price_vs_ma200 = ( ( ( tiker.prices_1h[(tiker.prices_1h.length-1)].ind_ma200   / tiker.price   ) -1 ) * 100 ).toFixed(2);
 
            await tiker.save();    
            q++;      
          }
      }
      return {dateToTicker: dateToTicker,
              tickersUpdated: q
            };
   };
}

module.exports = { TickerCtrl };