const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin',(req,res) => {
    res.render('./users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup',(req,res) => {
    res.render('./users/signup');
});

router.post('/users/signup',async (req,res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if (name.length <= 0) 
    {
        errors.push({text:'Se debe especificar un nombre'});
    }
    if (email.length <= 0) 
    {
        errors.push({text:'Se debe especificar un E-Mail'});
    }
    if (password.length < 4)
    {
        errors.push({text:'El Passwords debe tener al menos 4 caracteres'});
    }
    else if (password != confirm_password)
    {
        errors.push({text:'No coinciden los Passwords'});
    }
    
    if (errors.length > 0)
    {
      res.render('./users/signup',{errors, name, email, password, confirm_password});    
    }    
    else
    {
        const emailUser = await User.findOne({email: email});
        if (emailUser)
        {
            errors.push({text:'El E-Mail ya se encuentra registrado'});
            res.render('./users/signup',{errors, name, email, password, confirm_password});
        }
        else
        {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg','Se ha registrado la cuenta');
            res.redirect('/users/signin');
        }
    }

});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;