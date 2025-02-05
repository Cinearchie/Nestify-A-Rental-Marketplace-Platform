const Listing = require("../models/listing")

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing})
 }

module.exports.newListing = (req,res)=>{
    res.render("listings/new.ejs")
 }

 module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const al = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!al){
       req.flash("error","Listing doesn't exist!!")
       res.redirect("/listings")
    }
    res.render("listings/show.ejs",{al});
}
 module.exports.createListing = async (req , res , next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newL = new Listing(req.body.listing);
    newL.image = {url , filename};
    newL.owner = req.user._id;
    await newL.save();
    req.flash("success","Congratualtions!! New listing created.")
    res.redirect("/listings");
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const al = await Listing.findById(id);
    if(!al){
       req.flash("error","Mentioned listing doesn't exist!");
       res.redirect("/listings");
    }
    let original = al.image.url;
    original = original.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{al, original})
}

module.exports.updateListing = async(req,res)=>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success","Congratualtions!!Listing updated successfully.")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let{id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success","Listing deleted successfully.")
    res.redirect("/listings")
}