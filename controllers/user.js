const User = require("../models/user")

module.exports.renderSignup = (req ,res) =>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res) =>{
    try{
        let{username , email,password} = req.body;
        const newUser = new User({email , username});
        const regUser = await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Nestify.")
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
}

module.exports.renderLogin = (req,res) =>{
    res.render("users/login.ejs")
}

module.exports.logIn = async(req,res)=>{
    req.flash("success","welcome to Nestify.")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next) =>{
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success" , "You are logged out")
        res.redirect("/listings")
    })
}