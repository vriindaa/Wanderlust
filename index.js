if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//requiring routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//setting path and middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

//setting connection to database

// let mongoUrl = "mongodb://127.0.0.1:27017/wanderlust"
let  dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})

//connect-mongo config
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret: process.env.SECRET
    },
    touchAfter : 24*3600,
})

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

//express-session middleware
app.use(session({
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,

    //to increse expiry date of cookie
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly : true
    }
}))

//connect-flash m.w
app.use(flash());

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//res-locals M.w
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//routers middleware
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//setting port
app.listen(8080,(req,res)=>{
    console.log("server is listening at the port 8080");
})


//handling errors
app.all("*",(req,res,next)=>{
    throw new ExpressError(404, "Page not found!");
})

app.use((err,req,res,next)=>{
    let {status=500, message="Something went wrong!"} = err;
    res.status(status).render("./error/error.ejs",{message});
})