const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const { ppid } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const {reviewSchema} = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const mongo_url = 'mongodb://127.0.0.1:27017/nestify';
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}


const sessionOptions = {
    secret: "b7X$zP9w!KdQvR2LmN3Y",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    httpOnly: true
}

app.get("/",(req,res) =>{
    res.send("Its working");
})


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})

app.get("/demouser" , async(req,res)=>{
    let user = new User({
        email: "qwerty@gmail.com",
        username: "Archie"
    })

   let registered = await User.register(user , "helloworld")
   res.send(registered)
})

app.use("/listings",listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/" ,userRouter);

app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page not found!!!!"))
})
app.use((err , req , res , next) => {
    let{status = 500, message = "Something went wrong!!"} = err;
    res.status(status).render("listings/error.ejs" , {message});
})

app.listen(port,()=>{
    console.log("At your command, Sir!!");
})