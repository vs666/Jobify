const mongoose = require('mongoose');

var Recruiter = new mongoose.Schema({
    Name: String,
    Contact: String,
    Bio:String,
    Email:String,
    Hash:String, 
    Rating:{
        type:Number,
        default:0
    }  
});

module.exports = mongoose.model('recruiter',Recruiter,'Recruiter');