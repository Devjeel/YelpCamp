var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// app --> router

// INDEX Route
router.get("/", function(req, res){
    // get data from db
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index" , {campgrounds: allcampgrounds});   
        }
    });
});

// CREATE Route
router.post("/", middleware.isLoggedIn, function(req, res){
    
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var location = req.body.location;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {title: name, price: price, image: image, description: desc, author: author, location: location};
    
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            req.flash("New Campground has been added")
            console.log("Newly Created Campground:");
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });

// NEW Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// CREATE Route
router.get("/:id", function(req, res){
    // capture the id and find it in db
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function(req, res) {
    Campground.findById(req.params.id, function(err, findcampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit", {campground: findcampground});
        }
    });
})

// UPDATE Route
router.put("/:id", middleware.checkCampgroundOwnerShip, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCamp){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully edited!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwnerShip, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, deleteIt){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully removed")
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;