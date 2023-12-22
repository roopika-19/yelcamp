const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controller/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/',  validateReview, catchAsync(reviews.createReview))
router.delete('/:reviewId', isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;