const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
//const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');//const isLoggedIn = require('../middleware'); why this not work

const { campgroundSchema, reviewSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) { //check both
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

router.get('/', catchAsync(async (req, res) => {   //it will catch error and pass it to next
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

// router.get('/new', (req, res) => {
//     res.render('campgrounds/new');
// })
router.get('/new', isLoggedIn, (req, res) => {//allow to enter this page only if we login
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn,validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');//flash msg
    res.redirect(`/campgrounds/${campground._id}`)
}))


router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');//this will flash msg if we try to go to url that doesnot exist inspite of showing error but for that we have to write ejs which i havent
         return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;//added middleware isslognedin and isAuthor
//for explanation of each line
// const express = require('express');
// const router = express.Router();
// const campgrounds = require('../controller/campground');
// const catchAsync = require('../utils/catchAsync');
// const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// const Campground = require('../models/campground');

// router.route('/')
//     .get(catchAsync(campgrounds.index))
//     .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// router.route('/:id')
//     .get(catchAsync(campgrounds.showCampground))
//     .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
//     .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



// module.exports = router;