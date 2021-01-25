// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, Table, FormGroup, Col, Jumbotron, Label, Card } from 'react-bootstrap';
import Popup from './PopDetails';
export default class ShowList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hash: localStorage.getItem('hash'),  // not update
            viewStack: null,
            selJid: 0,
            ind: 1,
            editContent: {
                index: -1,
                id: null,
                deadline: null,
                maxPositions: 0,
                maxApplications: 0
            },
        }
        this.content = []
        this.visibleform = false;
    }

    componentDidMount() {
        this.ff1()
    }
    ff1() {
        console.log('Here FF1');
        var here = this;
        var data = {
            Hash: this.state.hash,
        }
        axios.post('http://localhost:5000/showPostings', data)
            .then((response) => {
                if (response.data.stat == 'Success') {
                    console.log(response.data.content)
                    var temp = response.data.content
                    here.content = response.data.content
                    var ht = ''
                    for (let x = 0; x < temp.length; x++) {
                        if ((temp[x]['Deadline'] + "").substring(0, 10) < (new Date().toISOString())) {
                            continue;
                        }
                        ht = ht + '<tr><td>' + temp[x]['Title'] + '</td><td>' + temp[x]['Recruiter']['Name'] + '</td><td>' + (temp[x]['Deadline'] + "").substring(0, 10) + '</td><td>' + (temp[x]['Votes']['count'] == 0 ? 'Unrated' : temp[x]['Votes']['Rating']) + '</td><td>' + temp[x]['Count']['currentApp'] + '</td><td>' + temp[x]['Duration'] + '</td><td>' + temp[x]['Salary'] + '</td><td><button value="viewapplications" id=\"' + temp[x]['_id'] + '\" type=\"submit\">View Applications</button></td>'
                        if (temp[x]['Count']['maxApp'] - temp[x]['Count']['currentApp'] > 0) {
                            ht = ht + '<td><button type=\"submit\" id=\"' + temp[x]['_id'] + '\" value=\"edit' + x + '\">Edit</button></td>'
                        }
                        else {
                            ht = ht + '<td style="color:grey">Edit</td>'
                        }
                        ht = ht + '</tr>'
                    }
                    // here.content = temp;
                    document.getElementById('hero').innerHTML = ht;
                }
                else {
                    console.log('3Here FF1');
                    console.log('Unable to Load Data')
                    // window.location.href = '/dashboard'
                }
            })
            .catch((error) => {
                console.log('4Here FF1');
                console.log(error, 'Error');
                // window.location.href = '/dashboard'
            })

        console.log('IS saved?? ', here.content)
    }


    handleChange = (event) => {
        const target = event.target;
        const field = target.name;
        const value = target.value



        this.setState({
            [field]: value
        });
    }

    checkInt(str) {
        return !isNaN(str);
    }

    togglePopup = (idval) => {
        this.setState({
            selJid: idval
        })
        var inps = {
            jobId: idval,
            hash: localStorage.getItem('hash')
        }
        axios.post('http://localhost:5000/getApplicants', inps)
            .then((response) => {
                console.log(response.data)
                if (response.data.stat == 'Success') {
                    console.log(response.data.content, 'Conty')
                    var st = '<tbody style="font-size:smaller;">';
                    for (let x = 0; x < response.data.content.length; x++) {
                        console.log(response.data.content[x]);
                        if (response.data.content[x]['cond'] == 'Rejected') {
                            continue;
                        }
                        st = st + '<tr><td style="padding:2%;">' + response.data.content[x]['details']['Name'] + '</td><td style="padding:2%;"><ul>';
                        for (let y = 0; y < response.data.content[x]['details']['College'].length; y++) {
                            st = st + '<li>' + response.data.content[x]['details']['College'][y]['Name'] + '</li>';
                        }
                        st = st + '</ul></td><td style="padding:2%;">';
                        for (let y = 0; y < response.data.content[x]['details']['College'].length; y++) {
                            st = st + '<li>' + response.data.content[x]['details']['College'][y]['startYear'] + ' - ' + response.data.content[x]['details']['College'][y]['endYear'] + '</li>';
                        }
                        st = st + '</ul></td><td style="padding:2%;"><ul>';
                        for (let y = 0; y < response.data.content[x]['details']['Skills'].length; y++) {
                            st = st + '<li>' + response.data.content[x]['details']['Skills'][y] + '</li>';
                        }
                        st = st + '</ul></td><td>' + response.data.content[x]['sop'];
                        st = st + '</td>';
                        st = st + '<td>' + ("" + response.data.content[x]['doa']).substring(0, 10);
                        st = st + '<td><a href="http://localhost:5000/cv/?Hash=' + response.data.content[x]['details']['Hash'] + '" target="_blank" rel="noopener noreferrer"><div id="link" style="height:100%;width:100%">Download CV</div></a></td>';
                        var acc = false;
                        if (response.data.content[x]['cond'] == 'Accepted') {
                            acc = true;
                            st = st + '<td style="color:green">Accepted</td>';
                        }
                        else if (response.data.content[x]['cond'] == 'Rejected') {
                            acc = true;
                            st = st + '<td style="color:red">Rejected</td>';
                        }
                        else if (response.data.content[x]['cond'] == 'Shortlisted') {
                            st = st + '<td><button style="background-color:lightgreen;" name="' + response.data.content[x]['details']['Hash'] + '" id="accept" value="' + response.data.content[x]['jid'] + '">Accept</button>';
                        }
                        else {
                            st = st + '<td><button style="background-color:cyan;color:blue" name="' + response.data.content[x]['details']['Hash'] + '" id="shortlist" value="' + response.data.content[x]['jid'] + '">Shortlist</button></td>';
                        }
                        if (!acc) {
                            st = st + '<td><button style="background-color:crimson;color:black" name="' + response.data.content[x]['details']['Hash'] + '" id="reject" value="' + response.data.content[x]['jid'] + '">Reject</button></td>'
                        }
                        st = st + '</tr>';
                    }
                    st = st + '</tbody>';
                    document.getElementById("renderlist").innerHTML = st;
                } else {
                    alert('Failed' + response.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    // Render form based on the user type  
    render() {


        var sortByProperty = (property, ind) => {
            return function (a, b) {
                if (a['details'][property] > b['details'][property])
                    return ind;
                else if (a['details'][property] < b['details'][property])
                    return (-1 * ind);

                return 0;
            }
        }

        var sortAndPlace = (cate) => {
            if (this.state.selJid == 0) {
                return;
            }
            var inps = {
                jobId: this.state.selJid,
                hash: localStorage.getItem('hash')
            }
            axios.post('http://localhost:5000/getApplicants', inps)
                .then((response) => {
                    console.log(response.data)
                    if (response.data.stat == 'Success') {
                        response.data.content = JSON.parse(JSON.stringify(response.data.content))
                        console.log(response.data.content, 'Conty')
                        var ii = this.state.ind;
                        this.setState({
                            ind: (-1 * ii)
                        })
                        response.data.content = response.data.content.sort(sortByProperty(cate, ii))
                        var st = '<tbody style="font-size:smaller;">';
                        for (let x = 0; x < response.data.content.length; x++) {
                            console.log(response.data.content[x]);
                            if (response.data.content[x]['cond'] == 'Rejected') {
                                continue;
                            }
                            st = st + '<tr><td style="padding:2%;">' + response.data.content[x]['details']['Name'] + '</td><td style="padding:2%;"><ul>';
                            for (let y = 0; y < response.data.content[x]['details']['College'].length; y++) {
                                st = st + '<li>' + response.data.content[x]['details']['College'][y]['Name'] + '</li>';
                            }
                            st = st + '</ul></td><td style="padding:2%;">';
                            for (let y = 0; y < response.data.content[x]['details']['College'].length; y++) {
                                st = st + '<li>' + response.data.content[x]['details']['College'][y]['startYear'] + ' - ' + response.data.content[x]['details']['College'][y]['endYear'] + '</li>';
                            }
                            st = st + '</ul></td><td style="padding:2%;"><ul>';
                            for (let y = 0; y < response.data.content[x]['details']['Skills'].length; y++) {
                                st = st + '<li>' + response.data.content[x]['details']['Skills'][y] + '</li>';
                            }
                            st = st + '</ul></td><td>' + response.data.content[x]['sop'];
                            st = st + '</td>';
                            st = st + '<td>' + ("" + response.data.content[x]['doa']).substring(0, 10);
                            st = st + '<td><a href="http://localhost:5000/cv/?Hash=' + response.data.content[x]['details']['Hash'] + '" target="_blank" rel="noopener noreferrer"><div id="link" style="height:100%;width:100%">Download CV</div></a></td>';
                            var acc = false;
                            if (response.data.content[x]['cond'] == 'Accepted') {
                                acc = true;
                                st = st + '<td style="color:green">Accepted</td>';
                            }
                            else if (response.data.content[x]['cond'] == 'Rejected') {
                                acc = true;
                                st = st + '<td style="color:red">Rejected</td>';
                            }
                            else if (response.data.content[x]['cond'] == 'Shortlisted') {
                                st = st + '<td><button style="background-color:lightgreen;" name="' + response.data.content[x]['details']['Hash'] + '" id="accept" value="' + response.data.content[x]['jid'] + '">Accept</button>';
                            }
                            else {
                                st = st + '<td><button style="background-color:cyan;color:blue" name="' + response.data.content[x]['details']['Hash'] + '" id="shortlist" value="' + response.data.content[x]['jid'] + '">Shortlist</button></td>';
                            }
                            if (!acc) {
                                st = st + '<td><button style="background-color:crimson;color:black" name="' + response.data.content[x]['details']['Hash'] + '" id="reject" value="' + response.data.content[x]['jid'] + '">Reject</button></td>'
                            }
                            st = st + '</tr>';
                        }
                        st = st + '</tbody>';
                        document.getElementById("renderlist").innerHTML = st;
                    } else {
                        alert('Failed' + response.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        return (
            <div style={{ marginTop: '10%' }}>
                <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <Table striped bordered hover variant="dark" onClick={(event) => {
                        event.preventDefault();
                        if ((event.target.value + "").substring(0, 4) == 'edit') {
                            // editJob(event.target.id);
                            let index0 = parseInt((event.target.value + "").substring(4));
                            console.log(this.content, 'blah');
                            this.setState({
                                editContent: {
                                    index: index0,
                                    id: event.target.id,
                                    maxPositions: this.content[index0]['Count']['maxPositions'],
                                    maxApp: this.content[index0]['Count']['maxApp'],
                                    deadline: this.content[index0]['Deadline'],
                                }
                            });
                            this.visibleform = true;
                        }
                        else {
                            this.togglePopup(event.target.id);
                        }
                    }
                    }>
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Recruiter</th>
                                <th>Deadline</th>
                                <th>Rating</th>
                                <th># of Posts</th>
                                <th>Duration</th>
                                <th>Salary</th>
                                <th>View Applications</th>
                                <th>Edit Job</th>
                            </tr>
                        </thead>
                        <tbody id="hero">
                        </tbody>
                    </Table>
                    <button onClick={
                        (event) => {
                            event.preventDefault();
                            document.getElementById("renderlist").innerHTML = "Results appear here";
                        }
                    }> Hide Results</button>

                    <Table striped bordered hover variant="dark" style={{ marginTop: '2%', fontSize: '2vh' }} onClick={(event) => {
                        if (event.target.id != 'link')
                            event.preventDefault();
                        console.log(event.target)

                        // send to server to select this candidate
                        if (event.target.id == "accept" || event.target.id == 'shortlist' || event.target.id == "reject") {
                            var da = {
                                stype: event.target.id == "accept" ? "Accepted" : (event.target.id == "reject" ? "Rejected" : "Shortlisted"),
                                jobId: event.target.value,
                                ApplicantId: event.target.name
                            }
                            axios.post('http://localhost:5000/selectCandidate', da)
                                .then((response) => {
                                    alert(response.data.message)
                                    this.togglePopup(event.target.value)
                                })
                                .catch((err) => {
                                    alert(err);
                                })
                        }
                    }
                    }>
                        <thead>
                            <tr>
                                <th onClick={(event) => {
                                    event.preventDefault();
                                    sortAndPlace('details.Name');
                                }}>Name</th>
                                <th>College</th>
                                <th>Duration</th>
                                <th>Skills</th>
                                <th>SOP</th>
                                <th onClick={(event) => {
                                    event.preventDefault();
                                    sortAndPlace('doa');
                                }}>Application Date</th>
                                <th>CV Download</th>
                                <th>Accept/Reject</th>
                            </tr>
                        </thead>
                        <tbody id="renderlist">
                        </tbody>
                    </Table>
                    <form id="editApplication" type="post" onSubmit={
                        (event) => {
                            event.preventDefault();

                            // Code to check constraints 
                            // var ind = this.state.editContent.index;
                            // this.setState({
                            //     editContent : {
                            //         maxPositions : (this.content[ind]['Count']['maxPositions']< this.state.editContent.maxPositions? this.state.editContent.maxPositions: this.content[ind]['Count']['maxPositions']),
                            //         maxPositions : (this.content[ind]['Count']['currentApp']< this.state.editContent.maxApplications? this.state.editContent.maxApplications: this.content[ind]['Count']['currentApp'])
                            //     }
                            // })
                            // axios post request here
                            axios.post('http://localhost:5000/editJob', { id: this.state.editContent })
                                .then((response) => {
                                    alert(response.data.message);
                                })
                                .catch((error) => {
                                    alert(error);
                                })
                            console.log(this.state.editContent)
                        }
                    }>
                        <p>
                            Job {this.state.editContent.id}
                        </p>
                        <button onClick={
                            (event) => {
                                event.preventDefault();
                                axios.post('http://localhost:5000/deleteJob', { id: this.state.editContent.id })
                                    .then((response) => {
                                        alert(response.data.message);
                                    })
                                    .catch((error) => {
                                        alert(error);
                                    })
                                console.log('Delete');
                            }
                        }>Delete</button>
                        <div>
                            <label style={{ marginRight: '2%' }}>Deadline</label>
                            <input type="date" value={this.state.editContent.deadline} onChange={
                                (event) => {
                                    event.preventDefault()
                                    this.setState({
                                        editContent: {
                                            id: this.state.editContent.id,
                                            deadline: event.target.value,
                                            maxApplications: this.state.editContent.maxApplications,
                                            maxPositions: this.state.editContent.maxPositions
                                        }
                                    })
                                }
                            }></input>
                        </div>
                        <div>
                            <label style={{ marginRight: '2%' }}>Max-Allowed Applicants</label>
                            <input type="number" value={this.state.editContent.maxApplications} onChange={
                                (event) => {
                                    event.preventDefault()
                                    this.setState({
                                        editContent: {
                                            id: this.state.editContent.id,
                                            deadline: this.state.editContent.deadline,
                                            maxApplications: event.target.value,
                                            maxPositions: this.state.editContent.maxPositions
                                        }
                                    })
                                }
                            }></input>
                        </div>
                        <div>
                            <label style={{ marginRight: '2%' }}>Max-Posts Open</label>
                            <input type="number" value={this.state.editContent.maxPositions} onChange={
                                (event) => {
                                    event.preventDefault()
                                    this.setState({
                                        editContent: {
                                            id: this.state.editContent.id,
                                            deadline: this.state.editContent.deadline,
                                            maxApplications: this.state.editContent.maxApplications,
                                            maxPositions: event.target.value
                                        }
                                    })
                                }
                            }></input>
                        </div>
                        <button>Edit</button>
                    </form>

                </Jumbotron>
            </div >

        );
    }
}
