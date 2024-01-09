const express = require("express");
const router = express.Router();
const passport = require("passport");
const {redirectUrl} = require("../middlewares/userMw.js");
const userContoller = require("../controllers/user.js");

//signup route
router.route("/signup")
.get(userContoller.signupForm)
.post(userContoller.postSignup);

//login route and
//login route-POST
//here using passport.authenticate m.w to authenticate user
//in its options failureFlash is true so it will automatically flash the msg if user is not found
//and failure hone pr redirect kr dega login ko hi
router.route("/login")
.get(userContoller.loginForm)
.post(redirectUrl ,passport.authenticate("local",{
    failureRedirect : "/login",
    failureFlash : true
}), userContoller.postLogin);

//logout route
router.get("/logout", userContoller.logout);

module.exports = router;