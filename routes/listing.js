const express = require("express");
const router = express.Router();
// error handling
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/Listing.js");
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js')
const listingController = require('../controllers/listing.js');


const multer = require('multer');
const {storage} = require('../cloudconfig.js');
const upload = multer({storage});


// serverside validation


// index route
router.get("/",wrapAsync(listingController.index));

// create route
router.get("/new",isLoggedIn,listingController.renderNewForm);

// show route
router.get("/:id", wrapAsync(listingController.showListing)); 

// create route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//  Edit  Form 
router.get("/:id/edit" ,isLoggedIn,wrapAsync(listingController.renderEditForm)); 

// update form
router.put("/:id", isLoggedIn,isOwner,wrapAsync(listingController.updateListing));

// DELETE ROUTE

router.delete("/:id",isLoggedIn,wrapAsync(listingController.deleteListing));



module.exports = router;