const mongoose = require('mongoose');

var Applicant = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Bio: {
        type: String
    },
    College: [
        {
            Name: {
                type: String,
                required: true
            },
            startYear: {
                type: String,
                required: true
            },
            endYear: {
                type: String,
                default:'Ongoing'
            }
        }
    ],
    Skills: {
        type:[String],
        index:true
    },
    EmailId: {
        type:String,
        required:true
    },
    Hash: {
        type:String,
        required:true
    },
    Type:{
        type:String,
        default:'Applicant'
    }
});

module.exports = mongoose.model('applicant', Applicant, 'Applicant');
