const express = require("express")
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")




//Review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.newReview))

//Review Delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))


module.exports = router;