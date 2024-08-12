const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/Listing.js");
const Review  = require("../models/review.js");
const {isLoggedIn,isReviewAuthor,validateReview} = require('../middleware.js')

const reviewController = require('../controllers/reviews.js');
// reviews
// post route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

// delete  review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview)); 

module.exports = router