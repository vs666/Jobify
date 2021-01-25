/**
 * Each job should contain 
 * 
 * 1. Title of job
 * 2. Name of Recruiter
 * 3. E-mail ID of recruiter
 * 4. Max number of applicants allowed
 * 5. Max number of positions allowed
 * 6. Date of Posting
 * 7. Date of Deadline
 * 8. Required skill set (as a list)
 * 9. Type of job
 * 10.Duration of job
 * 11.Salary per month
 * 12.Rating
 */

// import { json } from 'express';
// import Recruiter from './recruiter.js';
const Recruiter = require('./recruiter');

const addJob = (recruiterId, _title, _max_applicants, _max_positions, _init_date, _final_date, _skill, _type, _salary, _duration, _rating) => {
    var ob = new Recruiter(recruiterId);
    var dat = {};
    dat["job_title"] = _title;
    dat["rec_name"] = ob.loadName();
    dat["rec_id"] = ob.loadEmail();
    dat["max_appl"] = _max_applicants;
    dat["max_pos"] = _max_positions;
    dat["st_dt"] = _init_date;
    dat["end_dt"] = _final_date;
    dat["skills"] = _skill;
    dat["type"] = _type;
    dat["salary"] = _salary;
    dat["duration"] = _duration;
    dat["rating"] = _rating;

    console.log(JSON.stringify(dat))
    // insert to Mongo-DB or JSON DB
}


