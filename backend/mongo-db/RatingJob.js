const mongoose = require('mongoose');

var RatingJob = new mongoose.Schema({
    ApplicantHash:{
        type:String,
        required:true
    },
    JobId:{
        type:String,
        required:true
    },
    Rating:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('RatingJob', RatingJob, 'RatingJob');
