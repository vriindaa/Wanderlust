const Review = require("../models/review.js");
const Listing = require("../models/listing.js")

module.exports.addReview = async (req,res,next)=>{
    try{
        let {id} = req.params;
        let newReview = new Review({...req.body});
        newReview.author = req.user._id;
        let listing = await Listing.findById(id);
        listing.reviews.push(newReview);
        await listing.save();
        await newReview.save();
        req.flash("success","New review added!");
        res.redirect(`/listings/${id}`);
    }catch(err){
        next(err);
    }
}

module.exports.deleteReview = async (req,res,next)=>{
    try{
        let {id,reviewId} = req.params;
        //now deleting this review ref from listing too
        await Listing.findByIdAndUpdate(id, {$pull :{reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted!");
        res.redirect(`/listings/${id}`);
    }catch(err){
        next(err);
    }
}