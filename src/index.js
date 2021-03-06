const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const SocketIO = require('socket.io');
const moment = require('moment');

//Initializations
const app =  express();


require('./database');
require('./config/passport');

//Settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    layoutDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));

app.set('view engine','.hbs');

//Midlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));
//Use passport debe ir despues de use(session)
app.use(passport.initialize());
app.use(passport.session());
//Use flash debe ir despues de use(passport)
app.use(flash());

//Global Variables
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    res.locals.userName = (req.user ? req.user.name : null);
    
    next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));
app.use(require('./routes/logs'));

//Static Files
app.use(express.static(path.join(__dirname,'public')));

//Server is listening
const server = app.listen(app.get('port'), () => {
    console.log('Server running on port: ',app.get('port'));
});
const io = SocketIO(server);


//WebSockets
var basket_reservation = io.on('connection', (socket) => {
    //console.log('New Connection!',socket.id);

    socket.on('getPrices', function(data) {
        sendMessage('updatePrices'); 
    });

    socket.on('getTickerPrices', function(data) {
        sendMessage('updateTickerPrices',data); 
    });
    /*
    setInterval(function() {
        let time = new Date();
        socket.emit('lastupdate', {
           time: time
        });
        
    },1000);
    */   
       
});

// Helper to send message (it uses closure to keep a reference to the io connetion - which is stored in basket_reservation in your code)
const Ticker = require('./models/TickerMdl');

var sendMessage = async function (msg,data) {
    if (basket_reservation) {
    
        if (msg=='updatePrices')
        {
            const tickers = await Ticker.getPrices();
            basket_reservation.emit('updatePrices', {
                lastUpdate: tickers.lastUpdate,
                tickers: tickers.tickers
                }
            );

        }
        else if (msg=='updateTickerPrices')
        {
            const tickers = await Ticker.getTickerPrices('BTCUSDT','1m');
            basket_reservation.emit('updateTickerPrices', {tickers});
        }

        
    }
  };

app.get('/dbUpdated', function(req,res){
    sendMessage('updatePrices',req);
});
