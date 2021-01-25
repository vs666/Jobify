const mongoose = require('mongoose');

var Job = new mongoose.Schema({
    Title: {
        type:String,
        required:true
    },
    Recruiter: {
        Name:String,
        Hash:String
    },
    Count:{
        maxApp:{
            type:Number,
            required:true
        },
        currentApp:{
            type:Number,
            default:0
        },
        maxPositions:{
            type:Number,
            required:true
        }
    },
    PostDate:{
        type:Date,
        default:Date.now()
    },
    Deadline:{
        type:Date,
        required:true
    },
    SkillsRequired: {
        type:[String],
        index:true
    },
    JobType:{
        type:String,
        required:true
    },
    Duration: {
        type:Number,
        default:0   // 0 is infinite 
    },
    Salary: {
        type:Number,
        required:true
    },
    Votes:{
        count:Number,
        Rating:Number
    }
});

module.exports = mongoose.model('Job', Job, 'Job');
