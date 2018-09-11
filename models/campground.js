var mongoose = require("mongoose");

// SCHEMA
var CampgroundSchema = new mongoose.Schema({
    title: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt:{
        type:Date , default: Date.now  
    },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ]
});

module.exports = mongoose.model("Campground", CampgroundSchema);