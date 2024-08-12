const express = require("express");
const app = express();
const session = require('express-session');
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
    secret: 'mysupersecretstring',
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionOptions));
app.use(flash());
app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully")
    console.log(req.session);
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.locals.messages = req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})
app.get("/",(req,res)=>{
    res.send("iam root");
})
app.listen(8080,()=>{
    console.log("port 8080 is running")
})

