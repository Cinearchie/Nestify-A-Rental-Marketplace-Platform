const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js")


const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let message = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400 , message);
        }else{
            next();
        }
}

//Index
router.get("/",wrapAsync(async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing})
 }))
 //New
 router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
 })
 //show
 router.get("/:id",wrapAsync(async(req,res)=>{
     let {id} = req.params;
     const al = await Listing.findById(id).populate("reviews");
     if(!al){
        req.flash("error","Listing doesn't exist!!")
        res.redirect("/listings")
     }
     res.render("listings/show.ejs",{al});
 }))
 //Create 
 router.post("/",isLoggedIn,validateListing,wrapAsync(async (req , res , next) => {
         const newL = new Listing(req.body.listing);
         await newL.save();
         req.flash("success","Congratualtions!! New listing created.")
         res.redirect("/listings");
     }))
 //Edit 
 router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res)=>{
     let {id} = req.params;
     const al = await Listing.findById(id);
     if(!al){
        req.flash("error","Mentioned listing doesn't exist!");
        res.redirect("/listings");
     }
     res.render("listings/edit.ejs",{al})
 }))
 //Update 
 router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
     let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Congratualtions!!Listing updated successfully.")
    res.redirect("/listings");
 }))
 //Delete
 router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
     let{id} = req.params;
     let deleted = await Listing.findByIdAndDelete(id);
     console.log(deleted);
     req.flash("success","Listing deleted successfully.")
     res.redirect("/listings")
 }))
 

 module.exports = router;