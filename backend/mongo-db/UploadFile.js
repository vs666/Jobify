var mongoose = require('mongoose');

const File = new mongoose.Schema({
    meta_data:{}
});

module.exports = mongoose.model('File',File,'File');
