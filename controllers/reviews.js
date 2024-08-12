const Listing = require('../models/Listing');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    const review = req.body.review;
    console.log(review);
    const newReview =new Review(review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id);
    console.log(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};