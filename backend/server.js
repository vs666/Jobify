const axios = require('axios');
const bp = require('body-parser');
const cr = require('crypto-js');
const mongoose = require('mongoose');
const multer = require('multer');
const Applicant = require('./mongo-db/ApplicantSchema');
const express = require('express')
const app = express()
const port = 5000
const router = express.Router()
app.use(express.static('public'));
const cors = require('cors');
console.log('Starting');
const Login = require('./mongo-db/LoginInfo');
const Job = require('./mongo-db/JobsSchema');
const Recruiter = require('./mongo-db/RecSchema');
const JobApplication = require('./mongo-db/JobApplication');
const File = require('./mongo-db/UploadFile');
const { text } = require('body-parser');
const ApplicantSchema = require('./mongo-db/ApplicantSchema');
const RecSchema = require('./mongo-db/RecSchema');
const RatingJob = require('./mongo-db/RatingJob');
const nodemailer = require('nodemailer');
const GUESTHASH = 'Guest';


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientID: '',
        clientSecret: '',
    }
})



app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

mongoose.Promise = global.Promise
// const db = (query);
mongoose.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, (err) => {
    if (err) {
        console.log('Error ', err);
    }
})

const storage = multer.diskStorage({
    destination: "./FileUploads/",
    filename: function (req, file, callback) {
        callback(null, "upload-" + req.body.hash + require('path').extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
}).single("myfile");

router.post('/upload', (req, res) => {
    upload(req, res, () => {
        console.log('Request -> ', req.body);
        console.log('Request => ', req.file);
        const file = new File();
        file.meta_data = req.file;
        file.save().then(() => {
            res.send({ stat: 'Success', message: 'File Uploaded succesfully' })
        });
    });
})

app.use(router);

app.get('/loginTrial', (req, res) => {
    // All data is expected to be is JSON format
    console.log('Recieved Data on 127.0.0.1:5000/login url', req.body);
    res.sendStatus(200);
    // console.log('Inserting in database : ',dd);
    // var ob = new Applicant(dd);
    // ob.save((err, data) => {
    //     if(err){
    //         console.log('ERROR',err);
    //         res.send('Error :cry: ');
    //     }
    //     else{
    //         console.log('DONE!!');
    //         res.send('Success :smile: ');
    //     }
    // });
})

app.get('/ping', (req, res) => {
    res.send('Server is Up');
})

// primary login service
app.post('/login', (req, res) => {
    // encrypt using crypto-js and then check against the password hashes
    // add salting to passwords
    // req.body = {hash:userhash,type:usertype,email:loginEmail,pass:loginPass}
    console.log('req recv', JSON.stringify(req.body));
    if (req.body.hash != null && req.body.hash != GUESTHASH) {
        console.log('Already logged in')
        res.send({ stat: 'Error', message: 'Already signed in with another account' });
    }
    else {
        const Em = req.body.email;
        const PassHash = cr.SHA256('$start$' + req.body.password + '$end$').toString();
        // console.log('Em,Pass',Em,PassHash,req.body.password);
        // check with db password here
        console.log('us,pass', Em, PassHash);
        Login.findOne({ Email: Em, PasswordHash: PassHash }, (err, data) => {
            if (err) {
                console.log('Unsuccesful Login from IP ', req.ip.toString());
                res.send({ stat: 'Error', message: 'Login Failed' });
            }
            else {
                console.log(JSON.stringify(data))
                if (data == null) {

                    console.log('Unsuccesful Login from IP ', req.ip.toString());
                    res.send({ stat: 'Error', message: 'Login Failed' });
                }
                else {
                    console.log(data);
                    res.send({ stat: 'Success', userhash: cr.SHA256(Em + PassHash).toString(), usertype: data.Type });
                }
            }
        })
    }
})


app.get('/attainData', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var hash = req.query.hash == null ? 'Guest' : req.query.hash;
    var type = req.query.type
    console.log('Here, request', req.query)
    if (type == 'Applicant') {
        Applicant.findOne({ Hash: hash }, (err, data) => {
            if (err) {
                console.log('Data request not completed.');
                res.send(JSON.stringify({ Hash: 'Guest' }));
            }
            else {
                console.log('Sending data ', JSON.stringify(data));
                res.send(JSON.stringify(data));
            }
        });

    }
    else if (type == 'Recruiter') {
        Recruiter.findOne({ Hash: hash }, (err, data) => {
            if (err) {
                console.log('Data request not completed.');
                res.send(JSON.stringify({ Hash: 'Guest' }));
            }
            else {
                console.log('Sending data ', JSON.stringify(data));
                res.send(JSON.stringify(data));
            }
        });
    }
    else {
        console.log('DB data not found.')
        res.send(JSON.stringify({ Hash: 'Guest' }));  // hash value will tell if data is not found}
    }
});








/**
 * Apply for Job
 */
app.post('/applyForJob', (req, res) => {
    console.log(req.body, 'baadi');


    JobApplication.find({
        ApplicantHash: req.body.userhash,
        $or: [{ Status: "Accepted" }, { JobId: req.body.jid }]
    }, (err, dat) => {
        if (err) {
            res.send({ stat: 'Error', message: 'Database Error' });
        }
        else {
            if (dat.length != 0) {
                res.send({ stat: 'Error', message: 'Entry already exisits' });
            }
            else {

                JobApplication.find({
                    ApplicantHash: req.body.userhash,
                    $or: [{ Status: "Pending" }, { Status: "Shortlisted" }]
                }, (err, da) => {
                    if (err) {
                        res.send({ stat: 'Error', message: 'Database Error' });
                    }
                    else {
                        if (da.length >= 10) {
                            res.send({ stat: 'Error', message: 'Applications Limit(10) Exceeded' });
                        }
                        else {
                            const ob = new JobApplication({
                                RecruiterHash: req.body.recruiterhash,
                                ApplicantHash: req.body.userhash,
                                JobId: req.body.jid,
                                SOP: (req.body.sop + "").substring(0, ((req.body.sop + "").length < 256 ? (req.body.sop + "").length : 256)),
                            });
                            ob.save((err, data) => {
                                if (err) {
                                    res.send({ stat: 'Error', message: 'Database Error' })
                                }
                                else {
                                    Job.findByIdAndUpdate(req.body.jid,
                                        { $inc: { 'Count.currentApp': 1 } },
                                        (er, d) => {
                                            if (er) {
                                                res.send({ stat: 'Error', message: 'Database Error' })
                                            }
                                            else {
                                                res.send({ stat: 'Success', message: 'Applied' });
                                            }
                                        })
                                }
                            });
                        }
                    }
                })

            }
        }
    });




})

// primary sign in backend
app.post('/signIn', (req, res) => {
    // make a user ID with the given username and password
    // req.body = { hash:(CUSERHASH),email:loginEmail,password:LoginPassword}
    console.log(JSON.stringify(req.body));

    if (!(req.body.hash == null || req.body.hash == GUESTHASH)) {
        res.send({ stat: 'Error', message: 'Already signed in with another account' });
    }
    else {
        const emailId = req.body.Email;
        const PassHash = cr.SHA256('$start$' + req.body.Password + '$end$').toString();
        var foundId = false;
        Login.findOne({ EmailID: emailId }, (err, data) => {
            if (err) {
                // do nothing
            }
            else {
                foundId = true;
            }
        });
        if (!foundId) {
            var ob = new Login({
                UserHash: cr.SHA256(emailId + PassHash).toString(),
                Email: emailId.toString(),
                PasswordHash: PassHash,
                Type: req.body.Usertype,
            });
            ob.save((err, data) => {
                if (err) {
                    res.send({ stat: 'Error', message: 'Unable to create account' });
                }
                else {
                    if (req.body.Usertype == "Applicant") {
                        // update details of applicant

                        if (req.body.endYear == null) {
                            req.body.endYear = '-1';
                        }
                        // create entry for the first time
                        var oa = new Applicant({
                            Name: req.body.Name,
                            Bio: req.body.Bio,
                            College: req.body.College,
                            Skills: req.body.Skills,
                            EmailId: req.body.Email,
                            Hash: cr.SHA256(emailId + PassHash).toString(),
                            Type: req.body.Usertype,
                        })
                        oa.save((err, data) => {
                            if (err) {
                                console.log('Error is ' + err)
                                res.send({ stat: 'Error', message: 'ID creation succesful. Unable to Update details. Internal Error.' });
                            }
                            else {
                                res.send({ stat: 'Success', message: 'Update Successful', userhash: cr.SHA256(emailId + PassHash).toString(), usertype: req.body.Usertype });
                            }
                        });
                    }
                    else {
                        // update details of recr
                        var oa = new Recruiter({
                            Name: req.body.Name,
                            Contact: req.body.Contact,
                            Bio: req.body.Bio,
                            Email: req.body.Email,
                            Hash: cr.SHA256(emailId + PassHash).toString(),
                        })
                        oa.save((err, data) => {
                            if (err) {
                                res.send({ stat: 'Error', message: 'Unable to Update. Internal Error.' });
                            }
                            else {
                                res.send({ stat: 'Success', message: 'Update Successful', usertype: req.body.Usertype, userhash: cr.SHA256(emailId + PassHash).toString() });
                            }
                        });


                    }
                }
            });
        }
        else {
            res.send({ stat: 'Error', message: 'Account already exists.' });
        }
    }
})

/**
 * Add Job (by recruiter)
 * Post Date takes Default Value
 */
app.post('/addJob', (req, res) => {
    // req.body = {title,hash,applicationLimit,deadline,skills_req,positions, type,duration,salary,rating}
    console.log('Adding Job ', JSON.stringify(req.body));
    if (parseInt(req.body.Salary + "") < 0) {
        res.send({ stat: 'Error', message: 'Salary Invalid' });
    }
    else {
        // Check if hash is of recruiter and find the recruiter's name
        var RName = null
        Recruiter.findOne({ Hash: req.body.Hash }, (err, data) => {
            if (err) {
                res.send({ stat: 'Error', message: 'Unidentified User' });
            } else {

                // Append to DB
                var ob = new Job({
                    Title: req.body.Title,
                    Recruiter: {
                        Name: data['Name'],
                        Hash: req.body.Hash
                    },
                    Count: {
                        maxApp: req.body.Limit,
                        currentApp: 0,
                        maxPositions: req.body.Vaccancies
                    },
                    Deadline: req.body.Deadline,
                    SkillsRequired: req.body.SkillsRequired,    // this is a list of skills [skill1,skill2,...]
                    JobType: req.body.Type,
                    Duration: parseInt(req.body.Duration + ""),
                    Salary: parseInt(req.body.Salary + ""),
                    Votes: { count: 0, Rating: 0 }
                });
                ob.save((err, data) => {
                    if (err) {
                        res.send({ stat: 'Error', message: 'Details Updated' });
                    }
                    else {
                        res.send({ stat: 'Success', message: 'Details Updated' });
                    }
                })
            }
        })
    }
});

app.post('/recruiter/addDetails', (req, res) => {
    // details {name,contact(string),bio,email,hash(matching)}
    var found = false;
    Login.findOne({ EmailID: req.body.email, UserHash: req.body.hash }, (err, data) => {
        if (err) {
            // do nothing
        }
        else {
            found = true;
        }
    })
    if (!found) {
        res.send({ stat: 'Error', message: 'Denied access' });
    }
    else {
        var exists = false;
        Recruiter.findOne({ EmailID: req.body.email, UserHash: req.body.hash }, (err, data) => {
            if (err) {
                // do nothing
            }
            else {
                exists = true;
            }
        })
        if (exists) {
            Recruiter.updateMany({
                EmailID: req.body.email,
                hash: req.body.hash
            }, {
                Name: req.body.name,
                Contact: req.body.contact,
                Bio: req.body.bio
            }, (err, data) => {
                if (err) {
                    res.send({ stat: 'Error', message: 'Update Failed' });
                }
                else {
                    res.send({ stat: 'Success', message: 'Update Successful' });
                }
            });
        }
        else {
            // create entry for the first time
            var oa = new Recruiter({
                Name: req.body.name,
                Contact: req.body.contact,
                Bio: req.body.bio,
                Email: req.body.email,
                Hash: req.body.hash
            })
            oa.save((err, data) => {
                if (err) {
                    res.send({ stat: 'Error', message: 'Unable to Update. Internal Error.' });
                }
                else {
                    res.send({ stat: 'Success', message: 'Update Successful' });
                }
            });

        }

    }
})

app.post('/applicant/addDetails', (req, res) => {
    // details {}
    if (req.body.endYear == null) {
        req.body.endYear = '-1';
    }
    var found = false;
    Login.findOne({ EmailID: req.body.email, UserHash: req.body.hash }, (err, data) => {
        if (err) {
            // do nothing
        }
        else {
            found = true;
        }
    })
    if (!found) {
        res.send({ stat: 'Error', message: 'Denied access' });
    }
    else {
        var exists = false;
        Applicant.findOne({ EmailID: req.body.email, UserHash: req.body.hash }, (err, data) => {
            if (err) {
                // do nothing
            }
            else {
                exists = true;
            }
        })
        if (exists) {
            Applicant.updateMany({
                EmailID: req.body.email,
                hash: req.body.hash
            }, {
                Name: req.body.name,
                Bio: req.body.bio,
                CollegeName: req.body.college,
                StartYear: Integer.parseInt(req.body.startYear),
                EndYear: Integer.parseInt(req.body.EndYear),
                Skills: req.body.skills,
                Rating: req.body.rating,
            }, (err, data) => {
                if (err) {
                    res.send({ stat: 'Error', message: 'Update Failed' });
                }
                else {
                    res.send({ stat: 'Success', message: 'Update Successful' });
                }
            });
        }
        else {
            // create entry for the first time
            var oa = new Applicant({
                Name: req.body.name,
                Bio: req.body.bio,
                CollegeName: req.body.college,
                StartYear: Integer.parseInt(req.body.startYear),
                EndYear: Integer.parseInt(req.body.EndYear),
                Skills: req.body.skills,
                Rating: req.body.rating,
                EmailID: req.body.email,
                Hash: req.body.hash
            })
            oa.save((err, data) => {
                if (err) {
                    res.send({ stat: 'Error', message: 'Unable to Update. Internal Error.' });
                }
                else {
                    res.send({ stat: 'Success', message: 'Update Successful' });
                }
            });

        }

    }
})

function isValidHash(s) {
    return true;
}

app.post('/showApplications', (req, res) => {
    JobApplication.find({
        ApplicantHash: req.body.Hash
    }, (err, doc) => {
        if (err) {
            res.send({ stat: 'Error', message: 'Internal Error' });
        } else {
            console.log('doc is ', doc);
            var RV = []
            for (let x = 0; x < doc.length; x++) {
                Job.findOne({
                    _id: doc[x]['JobId']
                }, (err, data) => {
                    if (err) { } else {
                        console.log('data', x, data);
                        RV.push({ 'jd': doc[x], 'ud': data });
                        if (x == doc.length - 1) {
                            console.log(RV);
                            res.send({ stat: 'Success', dada: RV });
                        }
                    }
                })
            }
        }
    })
})

app.post('/showPostings', (req, res) => {
    console.log(req.body, '/showPostings')
    if (isValidHash(req.body.Hash)) {
        const XD = []
        var exitted = false
        Job.find({
            'Recruiter.Hash': req.body.Hash
        }, (err, docs) => {
            if (err) {
                console.log('Error', err);
            }
            else {
                // if (Object.keys(docs) == 0) {
                //     res.send({ stat: 'Error', content: [] });
                // }
                // else {
                console.log('docs is ', docs)
                // for (let x = 0; x < docs.length; x++) {
                //     Job.find({ _id: docs[x]['JobId'] }, (err, data) => {
                //         if (err) {
                //             // do nothing
                //         }
                //         else {
                //             XD.push({
                //                 'jd': docs[x],
                //                 'ud': data[0]
                //             });
                //         }
                //         if (x == docs.length - 1) {
                //             console.log('Data is ', XD)
                //             res.send({ stat: 'Success', content: XD });
                //         }
                //     });
                // }
                // }
                res.send({ stat: 'Success', content: docs })
            }
        });
    }
    else {
        res.send({ stat: 'Error', message: 'Invalid User' });
    }
})

app.post('/getApplicants', (req, res) => {
    console.log('request = ', req.body)
    var ret = [];
    JobApplication.find({
        JobId: req.body.jobId,
        RecruiterHash: req.body.hash
    }, (err, data) => {
        if (err) {
            res.send({ stat: 'Error', message: 'Server failed to yield response' })
        }
        else {
            console.log('data 1', data);
            for (let x = 0; x < data.length; x++) {
                Applicant.find({
                    Hash: data[x]['ApplicantHash']
                }, (err, doc) => {
                    if (err) {
                        // do nothing
                    }
                    else {
                        ret.push({ 'jid': data[x]['JobId'], 'sop': data[x]['SOP'], 'cond': data[x]['Status'], 'doa': data[x]['AppDate'], 'details': doc[0] })
                        console.log('Response sent is ', ret, doc);
                        if (x == data.length - 1) {
                            res.send({ stat: 'Success', content: ret });
                        }
                    }
                })
            }
        }
    })
})

app.post('/searchRequest', (req, res) => {
    console.log('Hello Challa', req.body);
    if (req.body.searchQuery != null) {
        if (req.body.duration == null || req.body.duration == '' || req.body.duration == '0') {
            req.body.duration = '100000'
        }

        // Apply all filters 
        const reg = new RegExp(escapeRegex(req.body.searchQuery), 'gi');
        const reg2 = new RegExp(escapeRegex(req.body.type), 'gi');
        Job.find({
            Title: reg,
            $and: [{ Salary: { $lte: parseInt(req.body.max_salary) } }, { Salary: { $gte: parseInt(req.body.min_salary) } }],
            $or: [{ Duration: { $lt: parseInt(req.body.duration) } }, { Duration: { $lte : 0} }],
            JobType: reg2,
            Deadline: { $gte: (new Date().toISOString()) },
        }, (err, docs) => {
            if (err) {
                console.log('Error', err);
                res.send({ stat: 'Error', message: 'DB Error' });
            }
            else {
                console.log('Raw Docs : ', docs);
                if (docs.length == 0) {
                    res.send({ stat: 'Error', message: 'Empty' });
                    console.log("No response");
                }
                else {
                    var RV = []
                    for (let x = 0; x < docs.length; x++) {
                        JobApplication.find({
                            ApplicantHash: req.body.hash,
                            JobId: docs[x]['_id']
                        }, (err2, dat) => {
                            console.log('dat is : ', dat);
                            if (err2) {
                                // do nothing
                                console.log('error');
                                RV.push({ 'dd': docs[x], 'st': 'NA' });
                                console.log('Hello0');
                                if (x == docs.length - 1) {
                                    console.log(RV, 'docs');
                                    res.send({ stat: 'Success', content: JSON.stringify(RV) });
                                }
                            }
                            else if (docs[x]['Count']['maxApp'] - docs[x]['Count']['currentApp'] == 0) {
                                console.log('Hello1');
                                RV.push({ 'dd': docs[x], 'st': 'Full' });
                                // docs[x][st]='Full';
                                if (x == docs.length - 1) {
                                    console.log(RV, 'docs');
                                    res.send({ stat: 'Success', content: JSON.stringify(RV) });
                                }
                            }
                            else {
                                if (dat.length == 0) {
                                    RV.push({ 'dd': docs[x], 'st': 'NA' });
                                    if (x == docs.length - 1) {
                                        console.log(RV, 'docs');
                                        res.send({ stat: 'Success', content: JSON.stringify(RV) });
                                    }

                                } else {
                                    console.log('Hello3', dat);
                                    RV.push({ 'dd': docs[x], 'st': dat[0]['Status'] });
                                    if (x == docs.length - 1) {
                                        console.log(RV, 'docs');
                                        res.send({ stat: 'Success', content: JSON.stringify(RV) });
                                    }
                                }

                            }

                        })
                    }
                }
            }
        });
    }
    else {
        res.send({ stat: 'Error', message: 'Debug Fail' });
    }
})

function escapeRegex(text) {
    console.log(text, 'text')
    text = text.toString()
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function isFull(jid) {
    var diff = 0
    Job.findById(jid, (e, d) => {
        if (e) {
            // do nothing
        }
        else {
            JobApplication.find({
                JobId: jid,
                Status: "Accepted"
            }, (err, doy) => {
                if (err) {
                }
                else {
                    diff = (d['Count']['maxPositions'] - doy.length);
                    return diff <= 0 ? true : false;
                    // console.log('Difference inside is ', diff);
                }
            })
        }
    })
    // console.log('Difference is ', diff);
}

app.post('/selectCandidate', (req, res) => {
    console.log('Selected for', req.body, 'Applicant', req.body.ApplicantId);
    if (req.body.stype == "Accepted" && isFull(req.body.jobId)) {
        res.send({ message: 'Maximum candidates selected' });
    } else {
        console.log("here also??!!!!")
        JobApplication.findOneAndUpdate(
            {
                ApplicantHash: req.body.ApplicantId,
                JobId: req.body.jobId
            },
            {
                Status: req.body.stype
            }, (err, doc) => {
                console.log(err ? err : doc)
            }
        )
        Job.findByIdAndUpdate(req.body.jobId,
            { $inc: { 'Count.currentApp': (req.body.stype == "Accepted" ? 0 : 0) } }, (err, doc) => {
                if (err) {
                    // do nothing
                }
                else {
                    Login.find({
                        UserHash: req.body.ApplicantId
                    }, (err, dat) => {
                        if (err) {
                            // nomail
                        }
                        else {
                            // send mail here
                            if (req.body.stype == "Accepted") {
                                JobApplication.updateMany({
                                    ApplicantHash : req.body.ApplicantId,
                                    $or : [{Status : "Pending"},{Status : "Shortlisted"}]
                                },
                                {
                                    Status : "Rejected"
                                },(er,da)=>{ 
                                    if(er){
                                        
                                    }
                                    else{

                                    }
                                })
                                console.log(doc, 'Doccument Type ----------\n------------------------');
                                var mailOp = {
                                    from: 'jobify.alicebob@gmail.com',
                                    to: dat[0]['Email'],
                                    subject: 'Congratulations on your selection for Job',
                                    text: 'Dear Applicant,\nCongratulations on being selected to work ' + doc['JobType'] + ' as ' + doc['Title'] + '. Your recruiter ' + doc['Recruiter']['Name']
                                }
                                console.log('Mail details : ' + mailOp)
                                transporter.sendMail(mailOp, (err, info) => {
                                    if (err) {
                                        console.log('Porr' + err);
                                    }
                                    else {
                                        console.log('Email Sent : ' + info.response);
                                    }
                                })
                            }

                        }
                    });

                }
            }
        );

        res.send({ message: 'Done' });
    }
})

app.post('/deleteJob', (req, res) => {
    Job.findByIdAndDelete(req.body.id, (err, doc) => {
        if (err) {
            res.send({ stat: 'Error', message: 'Error in deletion' });
        }
        else {
            JobApplication.deleteMany({
                JobId: req.body.id
            }, (err, dat) => {
                if (err) {
                    res.send({ stat: 'Error', message: 'Unable to do complete deletion' });
                }
                else {
                    console.log('Deleted');
                    res.send({ stat: 'Success', message: 'Deletion Succesful' });
                }
            })
        }
    });
})


app.post('/editJob', (req, res) => {
    req.body = req.body.id
    console.log(req.body)
    Job.findByIdAndUpdate(req.body.id, {
        Deadline: req.body.deadline,
        'Count.maxApp': req.body.maxApplications,
        'Count.maxPositions': req.body.maxPositions
    }, (err, doc) => {
        if (err) {
            res.send({ stat: 'Error', message: 'Unable to update database' });
        }
        else {
            res.send({ stat: 'Success', message: 'Database Updated' });
        }
    })
})

app.post('/acceptedApplicants', (req, res) => {
    JobApplication.find({
        RecruiterHash: req.body.Hash,
        Status: "Accepted"
    }, (err, doc) => {
        if (err) {
            console.log(err);
            console.log(err, 'DODODODODDODDO')
            res.send({ stat: 'Error', message: err });
        }
        else {
            var RV = [];
            for (let x = 0; x < doc.length; x++) {
                ApplicantSchema.find({
                    Hash: doc[x]['ApplicantHash']
                }, (err2, dat) => {
                    if (err2) {
                        // do nothing
                    }
                    else {
                        Job.find({ _id: doc[x]['JobId'] }, (err3, ddd) => {
                            if (err3) {
                                // do nothing
                            }
                            else {
                                RV.push({ 'job': ddd[0], 'user': dat[0] });
                            }
                            if (x == doc.length - 1) {
                                console.log('Acceoted Applicants are : ', RV);
                                res.send({ stat: 'Success', obj: JSON.stringify(RV) });
                            }
                        })
                    }
                })
            }
            if (doc.length == 0) {
                res.send({ stat: 'Error', obj: 'Empty' });
            }
        }
    })
})
function foundUser(userId, jobId) {
    var rv = false;
    RatingJob.find({
        ApplicantHash: userId,
        JobId: jobId
    }, (err, dat) => {
        if (err) {
            console.log('in err')
            return false;
        }
        else {
            console.log('in else', dat, dat.length)
            if (dat.length == 0) {
                console.log('len 0')
                return false;
            }
            return true;
            console.log('ln0')

        }
    })
}

function updateRating(jobId) {
    var sum = 0;
    var cou = 0;
    RatingJob.find({
        JobId: jobId
    }, (err, doc) => {
        if (err) {
            return;
        }
        else {
            cou = doc.length;
            for (let x = 0; x < doc.length; x++) {
                sum += doc[x]['Rating'];
                if (x == doc.length - 1) {
                    console.log('updating rating ... ', sum, cou);
                    Job.findByIdAndUpdate(jobId,
                        {
                            'Votes.count': cou,
                            'Votes.Rating': sum
                        }, (err, dat) => {
                            console.log(dat, 'is datapata');
                            return;
                        });
                }
            }
            return;
        }
    });
}

function rateUser(jobId, userId, rating) {
    console.log(foundUser(userId, jobId))
    if (foundUser(userId, jobId) == true) {
        console.log('HAHAHAHA\n\nHAHAHA')
        RatingJob.findOneAndUpdate({
            ApplicantHash: userId,
            JobId: jobId
        },
            {
                Rating: parseInt(rating)
            },
            (err, doc) => {
                if (err) {
                    console.log(err, 'Upon');
                    return ({ stat: 'Error', message: 'Update Failed' });
                }
                else {
                    console.log(doc, ' AAAA')
                    updateRating(jobId);
                    return ({ stat: 'Success', message: 'Updated Succesfully' });
                }
            })
    }
    else {
        const ob = RatingJob({
            ApplicantHash: userId,
            JobId: jobId,
            Rating: rating
        });
        ob.save((err, dat) => {
            if (err) {
                console.log(err, 'Updation');
                return ({ stat: 'Error', message: 'Update Failed' });
            }
            else {
                console.log(dat, 'dation');
                updateRating(jobId);
                return ({ stat: 'Success', message: 'Rating updated succesfully' });
            }
        })
    }
}

app.post('/rateJob', (req, res) => {
    console.log(req.body);
    res.send(rateUser(req.body.jobId, req.body.hash, parseInt(req.body.rating)))
})


// res.body = { hash, type (Applicant/Recruiter), ...update data}
app.post('/updateUser', (req, res) => {
    console.log('Data is : ', req.body);
    if (req.body.type == 'Recruiter') {
        RecSchema.findOneAndUpdate({
            Hash: req.body.hash
        },
            {
                Name: req.body.name,
                Contact: req.body.contact,
                Bio: req.body.bio
            }, (err, doc) => {
                if (err) {
                    console.log('Error :: ', err);
                    res.send({ stat: 'Error', message: 'Update Failed.' });
                }
                else {
                    console.log(doc);
                    res.send({ stat: 'Success', message: 'Update Succesful' });
                }
            })
    }
    else {
        ApplicantSchema.findOneAndUpdate({
            Hash: req.body.hash
        },
            {
                Skills: req.body.skills,
                College: req.body.college,  // contains previous entries as well 
                Name: req.body.name,
                Bio: req.body.bio
            }, (err, doc) => {
                if (err) {
                    console.log('Error', err);
                    res.send({ stat: 'Err', message: 'Unable to update' });
                }
                else {
                    console.log('Doc is ', doc);
                    res.send({ stat: 'Success', message: 'Update Succesful' });
                }
            });
    }
})


app.get('/cv', (req, res) => {
    res.download('./FileUploads/upload-' + req.query.Hash + '.pdf');
})


app.get('/dp', (req, res) => {
    res.download('./FileUploads/upload-' + req.query.Hash + '.png');
})
app.listen(port, () => {
    console.log('listening on port', port)
})
