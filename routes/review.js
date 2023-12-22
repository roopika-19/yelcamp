const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateCampground, isLoggedIn, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controller/reviews');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateCampground, catchAsync(createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

module.exports = router;