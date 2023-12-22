const express = require('express');
const router = express.Router();
const campgrounds = require('../controller/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');//HUM CLOUdinary folder pr gye no needof index as it already there
const upload = multer({ storage });//or waha ka storage utta lia

const Campground = require('../models/campground');

router.route('/') //group similar routes together
    .get(catchAsync(campgrounds.index))
    .post( upload.array('image'), catchAsync(campgrounds.createCampground))

router.get('/new',  campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put( isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete( isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;
//isLoggedin ko hatya kunki kaam kre if vo hai toh hum url ke through acess ni kr payenge