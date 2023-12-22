const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

const userRoutes = require('./routes 2/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes 2/reviews');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))//wemaking an public directory that has all scripts of boiler plate
//adding express session for authentication and flash
const sessionConfig = {//we get our cookie
    secret: 'thisshouldbeabettersecret!',
    resave: false, //baar baar save ni krta read in doc
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //cookie cannot be acess by client server
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//date.now is in millisecound we increase its expire for 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 //1week
    }
}
app.use(session(sessionConfig)) //setting up session
app.use(flash());//setup flASH
app.use(passport.initialize());//we intialise passport middleware which we r using for authentication
app.use(passport.session());//this session always come after session
// By configuring the session middleware before Passport, it ensures that Passport can use the session to store serialized user information.
passport.use(new LocalStrategy(User.authenticate())); //hey use that user model for authentication which is already inbuild

passport.serializeUser(User.serializeUser());//enteer into session
passport.deserializeUser(User.deserializeUser());//get us out of session
app.use((req, res, next) => {
    res.locals.currentUser = req.user;//currentuser store info of user used for butron
    res.locals.success = req.flash('success');//use a middleware for flash 
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})