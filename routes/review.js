const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controller/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

//router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
console.log(router.post('/' , isLoggedIn, validateReview,  async function(req, res){
    reviews.createReview()

  }))
router.post('/' , isLoggedIn, validateReview,  async function(req, res){
    reviews.createReview

  });

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;