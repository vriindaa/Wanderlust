const User = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.postSignup = async (req,res,next)=>{
    try{
        let{username, email, password} = req.body;
        let newUser = new User({username,email});
        let registeredUser = await User.register(newUser,password);
        //to login automatically after  signup
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.postLogin = (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","Logged out successfully!");
        res.redirect("/listings");
    })
}