const Listing = require('../models/Listing.js')
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    
    res.render("listings/show.ejs",{ listing });
}

module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename; 
    console.log(url);
    let listing = req.body.listing;
    let result = listingSchema.validate(req.body); 
    if(result.error){
        throw new ExpressError(400,result.err);
    }
    if(!listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    const newListing = new Listing(listing);
    newListing.owner = req.user._id; 
    newListing.image = {url,filename};
    await newListing.save();
    // req.flash("success","new listing created")
    res.redirect("/listings");
};

module.exports.renderEditForm= async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
};

module.exports.updateListing = async (req,res,next)=>{
    let {id} = req.params;
    
    await Listing.findByIdAndUpdate(id,{...newListing});  //newlisting is a object and by using ... we send one one into it
    res.redirect(`/listings/${id}`);

};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;

    let deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);

    res.redirect("/listings");
};