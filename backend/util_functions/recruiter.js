// import fs from 'fs';
// import info from './../json-db/rec_info.json'; 
const fs = require('fs');
var info = require('../json-db/rec_info.json');




class Recruiter {
    constructor(id) {
        this.id = id;
        let ind = 0;
        let found = false;
        for (ind = 0; ind < info["Recruiters"].length; ind++) {
            if (info["Recruiters"][ind]["id"] == id) {
                found = true;
                break;
            }
        }
        if (found == false) {
            this.data = { "name": "NA", "id": "NA", "email": "NA" };
        }
        else {
            this.data = info["Recruiters"][ind];
        }
    }

    loadName() {
        return this.data["name"];
    }
    loadEmail() {
        return this.data["email"];
    }
}


module.exports = Recruiter;