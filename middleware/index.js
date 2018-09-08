var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All Middle-ware Goes here
var middleWareObj = {};

middleWareObj.checkCampgroundOwnerShip = function(req, res, next){
    // is user logged in or not 
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, findcampground){
            if(err){
                req.flash("error", "Camoground not found!")
                res.redirect("/campgrounds");
            } else {
                // if user own the Camoground?
                if(findcampground.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back");
                }
            }
        });
        
    } else {
        req.flash("error", "You need to be LogIn to do that!!")
        res.redirect("back");
    }
}

middleWareObj.checkCommentOwnerShip = function(req, res, next){
    // is user logged in or not 
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, findComment){
            if(err){
                res.redirect("back");
            } else {
                // if user own the Comment?
                if(findComment.author.id.equals(req.user._id)){
                   //move to next function   
                   next();
                }else{
                    res.redirect("back");
                }
            }
        });
        
    } else {
        res.redirect("back");
    }
}

middleWareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Log In To-Do that!!");
    res.redirect("/login");
}

module.exports = middleWareObj;