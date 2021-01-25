const mongoose = require('mongoose');
// Password Salt : $s$<password>$e$ {<> not included}
var Login = new mongoose.Schema({
    UserHash:String, // Either applicant Hash or recruiter hash
    Email:String,
    PasswordHash:String,
    Type:String,
});

module.exports = mongoose.model('login', Login, 'LoginDB');

