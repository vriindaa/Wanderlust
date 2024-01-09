const express = require("express");
const router = express.Router();
const {isLoggedin, isOwner} = require("../middlewares/listingMw.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//index listing route
router.get("/", listingController.getListings);

//create new listing
router.route("/new")
.get( isLoggedin, listingController.createListing)
.post(isLoggedin,upload.single("image"), listingController.postListing)

//show filtered listings
router.get("/filter", listingController.getFListings);

//show searched listings
router.post("/search", listingController.getSListings);

//show, delete and post edit listing route
router.route("/:id")
.get(listingController.showListing)
.put(isLoggedin, isOwner,upload.single("image"),listingController.postEditedListing)
.delete(isLoggedin, isOwner, listingController.deleteListing)

//edit listing route
router.get("/:id/edit",isLoggedin, isOwner, listingController.editListing);

module.exports = router;