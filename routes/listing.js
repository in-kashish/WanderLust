const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{listingSchema} = require("../schema.js");
const Listing = require('../models/listing.js');
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req,body);
    if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, result.errMsg);
    }else{
      next();
    }
  };
  


//Index Ruote
router.get('/', wrapAsync(async (req, res) => {
    try {
      const allListings = await Listing.find({});
      res.render('listings/index', { allListings });
    } catch (err) {
      console.log('Error fetching listings:', err);
      res.status(500).send('Internal Server Error');
    }
  }));
  
  //New Route
  router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
  })
  
  //Show Route
  router.get("/:id", wrapAsync(async(req, res) => {
      let {id} = req.params;
      const listings = await Listing.findById(id).populate("reviews").populate("owner");
      if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs", {listings});
  }));

  //Create Route
  router.post("/", validateListing,
    wrapAsync (async (req, res) =>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
  );
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn, wrapAsync(async(req, res) => {
    let {id} = req.params;
    console.log( "id"+ {id})
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
  }));
  
   //Update Route
  // app.put("/listings/:id", async(req, res) => {
  //   let {id} = req.params;
  //   await Listing.findByIdAndUpdate(id, {...req.body.listing});
  //   res.redirect("/listings");
  // });
  router.put("/:id",isLoggedIn,validateListing, wrapAsync(async (req, res) => {
    try {
      let { id } = req.params;
      //Trim any extra spaces
      id = id.trim();
      //Validate if `id` is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Listing ID" });
      }
      //Perform the update
      const updatedListing = await Listing.findByIdAndUpdate(
        id, 
        { ...req.body.listing }, 
        { new: true, runValidators: true } // Ensures validation runs
      );
      //Handle case where listing is not found
      if (!updatedListing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.redirect("/listings");
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }));
  
  //Delete Route
  router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
  }));

  module.exports = router; 