const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
    {
        return next();
    }
    
    req.flash('error','Usuario no autorizado');
    res.redirect('/users/signin');
};

module.exports = helpers;