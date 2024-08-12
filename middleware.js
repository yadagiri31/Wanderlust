const Listing = require('./models/Listing');
const Review = require('./models/review.js')
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        console.log("you must be logged in");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    const newListing = req.body.listing;
    let listing = await Listing.findById(id);
    if(!currUser && listing.owner._id.equals(currUser._id)){
        console.log("you dont have permission to edit!")
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    const newListing = req.body.listing;
    let review = await Review.findById(reviewId);
    if(!currUser && !review.author._id.equals(res.locals.currUser._id)){
        console.log("you dont have permission to edit!")
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}