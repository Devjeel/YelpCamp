var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");
// app --> router

// Root Route
router.get("/", function(req, res){
     res.render("landing"); 
});

// ==============
// Auth Routes
// ==============

// SignUp Form
router.get("/register", function(req, res) {
    res.render("register");
});

// SignUp Logic
router.post("/register", function(req, res) {
    
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username }), req.body.password , function(err, user){
        if(err){
            req.flash("error", err)
            return res.render("register");
        }
        
        // else login the user
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + req.body.username)
            res.redirect("/campgrounds");
        });
    });
});

// Log In Route
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req, res) {
    
});

// LogOut Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged You Out!!");
    res.redirect("/campgrounds");
});

module.exports = router;