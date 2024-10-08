const User = require('../models/users');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register'); // Added a leading slash here
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
            req.flash('success', 'Welcome back!');
            res.locals.returnTo 
            res.redirect("/campgrounds");
        
}

