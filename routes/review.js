const express = require("express");
const router = express.Router({mergeParams:true});
const {isLoggedin,isAuthor} = require("../middlewares/reviewMw.js");
const reviewController = require("../controllers/review.js");

//add review route
router.post("/",isLoggedin,reviewController.addReview);

//delete review route
router.delete("/:reviewId", isLoggedin, isAuthor, reviewController.deleteReview);

module.exports = router;