const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    }, 
    async (email, password, done ) => {
        const user = await User.findOne({email: email});
        if (!user)
        {
            return done(null, false, {message: 'No se encuentra la direccion de E -Mail'});
        }
        else
        {
            const match = await user.matchPassword(password);
            if (match)
            {
                return done(null, user);
            }
            else
            {
                return done(null, false, {message: 'El password es incorrecto'});
            }
        }
    }
));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});