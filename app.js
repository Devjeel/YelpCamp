var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    User        = require("./models/user"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
   
   
// Requiring routes 
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");

//mongoose connection to mongodb
mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", {useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride ("_method"));
app.use(flash());

// seedDB(); //CAUTION: seedin the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Jeel is awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);

// PageNotFound Error 
app.get("*", function(req, res) {
    res.send("Page Not Found!!");
});

app.listen(process.env.PORT , process.env.IP , function(){
    console.log("Yelpcamp server has started!!");
});