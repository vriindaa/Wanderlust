const Review = require("../models/review.js");

module.exports.isLoggedin = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        //************NOTE************************
        //saving original url in session
        //not storing it in res.locals bcz for every req-response cycle new response object is created
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","Access denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}