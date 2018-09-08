var express = require("express");
var router  = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

// app --> router

// COMMENT CREATE 
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});
// COMMENT -submitting data
router.post("/", middleware.isLoggedIn,function(req, res){
    // find campground by ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // here we directly use comment becoz its object bcoz of input name in show file
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // save Comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment successfully added!")
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    }); 
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id , comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully edited!!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnerShip, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deleteCamp){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!")
            res.redirect("back");
        }
    })
})

module.exports = router;