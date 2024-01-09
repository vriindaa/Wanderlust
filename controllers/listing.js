const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.getListings = async (req,res,next)=>{
    try{
        let listings = await Listing.find({});
        res.render("./listings/index.ejs",{listings});
    }catch(err){
        next(err);
    }
}

module.exports.createListing = (req,res,next)=>{
    res.render("./listings/new.ejs");
}

module.exports.postListing = async (req,res,next)=>{
    try{
        let response = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
          })
            .send()

        let url = req.file.path;
        let filename = req.file.filename;
        let newList = new Listing({...req.body});
        newList.owner = req.user;
        newList.image = {url, filename};
        
        //saving coordinates for map
        newList.geometry = response.body.features[0].geometry;

        let saved = await newList.save();
        console.log(saved);

        //flash for new listing
        req.flash("success","New listing created!");

        res.redirect("/listings");
    }catch(err){
        next(err);
    }
}

module.exports.showListing = async (req,res,next)=>{
    try{
        let {id} = req.params;
        let list = await Listing.findById(id).populate({path:"reviews",populate:{path : "author"}}).populate("owner");
        if(!list){
            req.flash("error","Listing you requested for doesn't exist");
            res.redirect("/listings");
        }
        res.render("./listings/show.ejs",{list});
    }catch(err){
        next(err);
    }
}

module.exports.editListing = async (req,res,next)=>{
    try{
        let {id} = req.params;
        let list = await Listing.findById(id);
        if(!list){
            req.flash("error","Listing you requested for doesn't exist");
            res.redirect("/listings");
        }
        let orgUrl = list.image.url;
        orgUrl = orgUrl.replace("/upload","/upload/w_200/e_blur:100");
        res.render("./listings/edit.ejs",{list, orgUrl});
    }catch(err){
        next(err);
    }
}

module.exports.postEditedListing = async (req,res,next)=>{
    try{
        let {id} = req.params;
        let updateList = await Listing.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});

        //this condition is to check if the user has edited the previous image too
        if(typeof req.file !== "undefined"){
            updateList.image.url = req.file.path;
            updateList.image.filename = req.file.filename;
        }

        await updateList.save();
        req.flash("success","Listing updated!");
        res.redirect(`/listings/${id}`);
    }catch(err){
        next(err);
    }
}

module.exports.deleteListing = async (req,res,next)=>{
    try{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        //deleted it's associated reviews through mongoose m.w
        req.flash("success","Listing deleted!");
        res.redirect("/listings");
    }catch(err){
        next(err);
    }
}

module.exports.getFListings = async (req,res)=>{
    let {f} = req.query;
    let listings = await Listing.find({category : f});
    if(listings.length){
       return res.render("./listings/f-list.ejs",{listings});
    }

    req.flash("error","No listings available of specified filter");
    res.redirect("/listings");
    
}

module.exports.getSListings= async (req,res)=>{
    let {location} = req.body;

    if(location===""){
       return res.redirect("/listings");
    }

    //returns string in regular expression
    let regLoc = new RegExp(location,"i");

    let listing1 = await Listing.find({location : regLoc});
    let listing2 = await Listing.find({country : regLoc});
    
    let listings = listing1.concat(listing2);
    
    if(listings.length){
        return res.render("./listings/f-list.ejs",{listings});
    }
 
     req.flash("error",`No listings available for location ${location}`);
     res.redirect("/listings");
}