const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const reviewSchema = new mongoose.Schema({
    comment : {
        type : String,
        required : true,
        trim : true
    },
    rating : {
        type : Number
    },
    created_at : {
        type : Date,
        default: Date.now()
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
})

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;