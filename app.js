if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const {listingSchema,reviewSchema} = require("./schema.js");
const path = require("path");
const ejsMate = require("ejs-mate"); 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); 
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);  
// sessions
const session = require('express-session');
const flash = require("connect-flash");
// models
const Listing = require("./models/Listing.js");
const Review  = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
// routers
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

// configuring strategy
const passport =  require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")
// connecting to mongodb
main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}




const sessionOptions = {
    secret: 'mysupersecretstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires:Date.now() + 7 *24*60*60*1000,
        maxAge:7 *24*60*60*1000,
        httpOnly:true
    }
}



app.get("/",(req,res)=>{
    res.send("iam root");
})

app.use(session(sessionOptions));
app.use(flash());

// after session
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
 

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);
 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
})
app.listen(8080,()=>{
    console.log("port 8080 is runnning");
})