const mongoose = require('mongoose');

var JobApplication = new mongoose.Schema({
    RecruiterHash:{
        type:String,
        required:true
    },
    ApplicantHash:{
        type:String,
        required:true
    },
    JobId:{
        type:String,
        required:true
    },
    SOP:{
        type:String
    },
    AppDate:{
        type:Date,
        default:Date.now()
    },
    Status:{
        type:String,
        default:'Pending'
    }
})

module.exports = mongoose.model('JobApplication', JobApplication, 'JobApplication');
