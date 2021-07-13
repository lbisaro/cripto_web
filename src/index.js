const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const SocketIO = require('socket.io');

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

var dato = {id: '12345',
            }

//WebSockets
io.on('connection', (socket) => {
    console.log('New Connection!',socket.id);

    setInterval(function() {
        let time = new Date();
        socket.emit('lastupdate', {
           time: time
        });
        
    },1000);

    /*
        socket.on('MENSAJE-RECIBIDO', function(data) {
            //broadcast.emit() -> esto emite un mensaje a todos, menos a quien lo envio.
            socket.broadcast.emit('MENSAJE-A-ENVIAR', { 
                id: '12345',
                name: 'Pedro'
            }); 
        }
        
        
    */
});