const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controller/reviews');
const catchAsync = require('../utils/catchAsync');

router.post('/',  validateReview, catchAsync(createReview))
router.delete('/:reviewId', isReviewAuthor, catchAsync(deleteReview))

module.exports = router