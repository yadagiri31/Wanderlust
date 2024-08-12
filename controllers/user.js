const User  = require("../models/user.js");

module.exports.renderSignup = async(req,res)=>{
    res.render("signup.ejs");
};
module.exports.signup = async (req,res)=>{
    try{
    const {username,email,password} = req.body;
    const registeredUser = await User.register({username,email},password);
    console.log(registeredUser);
    req.login(registeredUser,function(err){
        if(err){
            return next(err);

        }
        res.redirect("/listings");
    })
    }catch(e){
        console.log(e);
        res.redirect('/signup');
    }

    
};

module.exports.renderLogin = (req,res)=>{
    res.render("login.ejs");
}

module.exports.login = async(req,res)=>{
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        console.log("you are logged out");
        res.redirect("login");
    })
}