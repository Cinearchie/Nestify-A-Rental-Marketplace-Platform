const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({storage})


router
    .route("/")
    .get(wrapAsync(listingController.index)) //Index
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing)) //Create

 //New
router.get("/new",isLoggedIn,listingController.newListing);
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))//show
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing)) //Update
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

 //Edit 
 router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing))
 
 
 module.exports = router;