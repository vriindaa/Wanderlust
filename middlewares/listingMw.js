const Listing = require("../models/listing.js");

module.exports.isLoggedin = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        //************NOTE************************
        //saving original url in session
        //not storing it in res.locals bcz for every req-response cycle new response object is created
        req.session.redirectUrl = req.originalUrl;
        console.log(res.locals.redirectUrl);
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list.owner.equals(res.locals.currUser._id)){
        req.flash("error","Access denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
