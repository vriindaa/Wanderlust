const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title : {
        type :  String,
        required:true,
        trim :  true
    },
    description : {
        type : String,
        required : true,
        trim :  true
    },
    image : {
        // type : String,
        // default : "https://unsplash.com/photos/beige-couch-and-armchair-tHkJAMcO3QE",
        // set : (v) => v===""?"https://cityfurnish.com/blog/wp-content/uploads/2023/07/living-room-filled-with-furniture-red-wall-generative-ai-image-min.jpg":v


        url : {
            type : String,
            required : true
        },
        filename : {
            type : String,
            required : true
        },
        
    },
    price : {
        type : Number,
        required : true
    },
    country : {
        type : String,
        required : true,
        trim :  true
    },
    location : {
        type : String,
        required: true,
        trim :  true
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },

    category : {
        type: String,
        enum : ["Trending","Farms","Beaches","Tiny Homes","Amazing Pools","Camping","Mountains","Castles","Iconic Cities"],
    }
})

//deleting reviews for a particular listing deletion
listingSchema.post("findOneAndDelete",async (listing)=>{
    try{
        if(listing.reviews.length){
            await Review.deleteMany({_id:{$in:listing.reviews}});
        }
    }catch(err){
        next(err);
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;