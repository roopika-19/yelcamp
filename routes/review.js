const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateCampground, isLoggedIn, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controller/reviews');
const catchAsync = require('../utils/catchAsync');

router.post('/',  validateReview, catchAsync(reviews.createReview))
router.delete('/:reviewId', isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;