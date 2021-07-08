const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cripto', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('Conexion a la base de datos: OK!'))
.catch(err => console.err(err))




