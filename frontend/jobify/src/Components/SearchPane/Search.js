// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, Jumbotron, Dropdown, FormControl, DropdownButton, InputGroup, Table, ButtonGroup, Label, Card } from 'react-bootstrap';
import Parser from 'html-react-parser';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
export default class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hash: localStorage.getItem('hash'),  // not update
            searchQuery: '',
            max_salary: 100000000000,
            min_salary: 0,
            duration: '',
            type: '',
            ord: 1,
            choosenIndex: -1,
            rating: -1,
            results: [],
        }
        this.enableTextbar = false;
        this.selectedRow = -1;
    }

    checkInt(str) {
        return !isNaN(str);
    }

    applyNow() {

    }

    // Render form based on the user type  
    render() {

        var postSearch = (event) => {
            // axios call to db goes here
            event.preventDefault();
            this.setState({
                results: []
            });
            axios.post('http://localhost:5000/searchRequest', this.state)
                .then((response) => {
                    document.getElementById('result-for-search').innerHTML = '';
                    if (response.data.stat == 'Success') {
                        this.setState({
                            results: JSON.parse(response.data.content)
                        })
                        var tableHTML = ""
                        var nos = 0;
                        console.log(this.state.results, 'new results')

                        for (var eachElt in this.state.results) {
                            var eachItem = this.state.results[eachElt]['dd']
                            console.log('eachItem', eachItem);

                            // type filter ( to be tested on Saturday)
                            // if(this.state.type == 'parttime' && eachItem['Type']!='PartTime'){
                            //     continue;
                            // }else if(this.state.type == 'wfh' && eachItem['Type']!='WorkFromHome'){
                            //     continue;
                            // } else if(this.state.type == 'fulltime' && eachItem['Type']!='FullTime'){
                            //     continue;
                            // }

                            tableHTML += "<tr>";
                            tableHTML += "<td>" + nos + "</td>";
                            tableHTML += "<td>" + eachItem['Title'] + "</td>";
                            tableHTML += "<td>" + eachItem['Recruiter']['Name'] + "</td>";
                            tableHTML += "<td>" + (eachItem['Votes']['count'] == 0 ? 'unrated' : (parseFloat("" + eachItem['Votes']['Rating']) / eachItem['Votes']['count'])) + "</td>";
                            tableHTML += "<td>" + eachItem['Salary'] + "</td>";
                            tableHTML += "<td>" + eachItem['Duration'] + " months</td>";
                            tableHTML += "<td>" + (eachItem['Deadline'] + "").substring(0, 10) + "</td>";
                            if (this.state.results[eachElt]['st'] == 'NA')
                                tableHTML += "<td><button value=\"button\" id=\"" + eachItem['_id'] + "\" type=\"submit\">Apply Now</button></td>";
                            else if (this.state.results[eachElt]['st'] == 'Full') {
                                tableHTML += "<td style=\"color:yellow\">Full</td>";
                            }
                            else if (this.state.results[eachElt]['st'] == 'Pending') {
                                tableHTML += "<td style=\"color:blue\">Pending</td>";
                            }
                            else if (this.state.results[eachElt]['st'] == 'Accepted') {
                                tableHTML += "<td style=\"color:green\">Accepted</td>";
                            }
                            else if (this.state.results[eachElt]['st'] == 'Shortlisted') {
                                tableHTML += "<td style=\"color:brown\">Shortlisted</td>";
                            }
                            else if (this.state.results[eachElt]['st'] == 'Rejected') {
                                tableHTML += "<td style=\"color:crimson\">Rejected</td>";
                            } tableHTML += "</tr>";
                            nos++;
                        }

                        document.getElementById('result-for-search').innerHTML = tableHTML;
                    }
                    else {
                        alert(response.data.message)
                        // window.location.href='/dashboard';
                    }
                })
                .catch((err) => {
                    alert(err);
                    // window.location.href = '/dashboard';
                })

        }
        var sortByProperty = (property, ind) => {
            if (property != 'Votes.Rating') {
                return function (a, b) {
                    if (a['dd'][property] > b['dd'][property])
                        return ind;
                    else if (a['dd'][property] < b['dd'][property])
                        return (-1 * ind);

                    return 0;
                }
            }
            else {
                return function (a, b) {
                    // alert(a['dd']['Votes']['count'],a['dd']['Votes']['Rating']);
                    if (((a['dd']['Votes']['count'] != 0) ? (parseFloat("" + a['dd']['Votes']['Rating']) / a['dd']['Votes']['count']) : 0) > ((b['dd']['Votes']['count'] != 0) ? (parseFloat("" + b['dd']['Votes']['Rating']) / b['dd']['Votes']['count']) : 0))
                        return ind;
                    else if (((a['dd']['Votes']['count'] != 0) ? (parseFloat("" + a['dd']['Votes']['Rating']) / a['dd']['Votes']['count']) : 0) < ((b['dd']['Votes']['count'] != 0) ? (parseFloat("" + b['dd']['Votes']['Rating']) / b['dd']['Votes']['count']) : 0))
                        return (-1 * ind);
                    return 0;
                }
            }
        }

        var sortAndPlace = (cate) => {
            var ii = this.state.ord;
            this.setState({
                results: this.state.results.sort(sortByProperty(cate, ii)),
                ord: (ii == 1 ? -1 : 1)
            });
            var tableHTML = ""
            var nos = 0;
            console.log(this.state.results, 'new results')

            for (var eachElt in this.state.results) {
                var eachItem = this.state.results[eachElt]['dd']
                console.log('eachItem', eachItem);

                // type filter ( to be tested on Saturday)
                // if(this.state.type == 'parttime' && eachItem['Type']!='PartTime'){
                //     continue;
                // }else if(this.state.type == 'wfh' && eachItem['Type']!='WorkFromHome'){
                //     continue;
                // } else if(this.state.type == 'fulltime' && eachItem['Type']!='FullTime'){
                //     continue;
                // }

                tableHTML += "<tr>";
                tableHTML += "<td>" + nos + "</td>";
                tableHTML += "<td>" + eachItem['Title'] + "</td>";
                tableHTML += "<td>" + eachItem['Recruiter']['Name'] + "</td>";
                tableHTML += "<td>" + (eachItem['Votes']['count'] == 0 ? 'unrated' : (parseFloat("" + eachItem['Votes']['Rating']) / eachItem['Votes']['count'])) + "</td>";
                tableHTML += "<td>" + eachItem['Salary'] + "</td>";
                tableHTML += "<td>" + eachItem['Duration'] + " months</td>";
                tableHTML += "<td>" + (eachItem['Deadline'] + "").substring(0, 10) + "</td>";
                if (this.state.results[eachElt]['st'] == 'NA')
                    tableHTML += "<td><button value=\"button\" id=\"" + eachItem['_id'] + "\" type=\"submit\">Apply Now</button></td>";
                else if (this.state.results[eachElt]['st'] == 'Full') {
                    tableHTML += "<td style=\"color:yellow\">Full</td>";
                }
                else if (this.state.results[eachElt]['st'] == 'Pending') {
                    tableHTML += "<td style=\"color:blue\">Pending</td>";
                }
                else if (this.state.results[eachElt]['st'] == 'Accepted') {
                    tableHTML += "<td style=\"color:green\">Accepted</td>";
                }
                else if (this.state.results[eachElt]['st'] == 'Shortlisted') {
                    tableHTML += "<td style=\"color:brown\">Shortlisted</td>";
                }
                else if (this.state.results[eachElt]['st'] == 'Rejected') {
                    tableHTML += "<td style=\"color:crimson\">Rejected</td>";
                }
                tableHTML += "</tr>";
                nos++;
            }
            document.getElementById('result-for-search').innerHTML = tableHTML;
        }

        var postApplication = (pos, uid) => {
            // code stuff

            // Now we want to send the following data about the job applicant wants to apply for
            // RecruiterHash, ApplicantHash, Jobid, SOP, Date-of-Application
            // alert('Submitting...'+uid)
            // console.log('Res : ',this.state.results[0])
            for (let i = 0; i < this.state.results.length; i++) {
                console.log(this.state.results[i], uid)
                if (this.state.results[i]['dd']['_id'] == uid) {
                    if (this.state.results[i]['dd']['Count']['maxApp'] - this.state.results[i]['dd']['Count']['currentApp'] != 0) {
                        var data = {
                            userhash: localStorage.getItem('hash'),
                            recruiterhash: this.state.results[i]['dd']['Recruiter']['Hash'],
                            jid: uid,
                            sop: pos
                        }
                        axios.post('http://localhost:5000/applyForJob', data)
                            .then((response) => {
                                alert(response.data.message)
                            })
                            .catch((err) => {
                                alert(err)
                            })
                    }
                }
            }
        }
        return (
            <div style={{ marginTop: '10%' }}>
                <Jumbotron style={{ marginLeft: '5vh', marginRight: '5vh', color: '#055', backgroundColor: 'rgba(110,200,200,0.2)' }}>
                    <p style={{ fontFamily: 'Helvetica Neue', fontWeight: '800', fontSize: '5vh', color: 'black' }}>Searh for Jobs</p>
                    <Form inline method="post" onSubmit={postSearch}>

                        <FormControl type="text" placeholder="Search" value={this.state.searchQuery} onChange={
                            (event) => {
                                event.preventDefault()
                                this.setState({
                                    searchQuery: event.target.value
                                })
                            }
                        } className="mr-sm-2" />
                        <Form.Group controlId="exampleForm.ControlSelect1" style={{ paddingRight: '1vh' }}>
                            <select value={this.state.type} onChange={(event) => { this.setState({ type: event.target.value }) }}>
                                <option value="">Any Type</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Full-Time">Full-Time</option>
                                <option value="Work From Home">Work From Home</option>
                            </select>
                        </Form.Group>

                        <FormControl type="number" placeholder="Duration in Months" style={{ marginRight: '2%' }} value={this.state.duration} onChange={
                            (event) => {
                                event.preventDefault()
                                this.setState({
                                    duration: event.target.value
                                });
                            }
                        } />
                        <InputGroup className="mb-3" style={{ paddingTop: '2vh' }}>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Salary Range</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl type="number" placeholder="Min Salary" value={this.state.min_salary} onChange={(event) => { this.setState({ min_salary: event.target.value }) }} />
                            <FormControl type="number" placeholder="Max Salary" value={this.state.max_salary} onChange={(event) => { this.setState({ max_salary: event.target.value }) }} />
                            <Button style={{ marginLeft: '2vh', paddingLeft: '2vh' }} variant="success" type="submit">GO</Button>
                        </InputGroup>
                    </Form>
                    <div style={{ paddingTop: '3%' }}>
                        <Table striped bordered hover variant="dark" responsive style={{ backgroundColor: 'rgba(50,50,50,0.6' }} onClick={
                            (event) => {
                                event.preventDefault();
                                if (event.target.value != 'button') {
                                    // alert('Gotcha')
                                    return;
                                }
                                var sop = prompt('Enter SOP', "");
                                postApplication(sop, event.target.id)
                                // postSearch(event);
                            }
                        }>
                            <thead>
                                <tr>
                                    {/*Add onclick sort function*/}
                                    <th>#</th>
                                    <th>Job Title</th>
                                    <th>Recruiter</th>
                                    <th onClick={(event) => {
                                        event.preventDefault();
                                        sortAndPlace('Votes.Rating');
                                    }}>Rating{this.state.ord == 1 ? ('\u2193') : ('\u2191')}</th>
                                    <th onClick={(event) => {
                                        event.preventDefault();
                                        sortAndPlace('Salary');
                                    }}>Salary{this.state.ord == 1 ? ('\u2193') : ('\u2191')}</th>
                                    <th onClick={(event) => {
                                        event.preventDefault();
                                        sortAndPlace('Duration');
                                    }}>Duration{this.state.ord == 1 ? ('\u2193') : ('\u2191')}</th>
                                    <th onClick={(event) => {
                                        event.preventDefault();
                                        sortAndPlace('Deadline');
                                    }}>Deadline of Application{this.state.ord == 1 ? ('\u2193') : ('\u2191')}</th>
                                    <th>Apply Now</th>
                                </tr>
                            </thead>
                            <tbody id="result-for-search" >
                                {/*  */}
                            </tbody>

                        </Table>
                    </div>
                    <div>
                        <p>Rate a Job</p>
                        <p>Rating</p>
                        <input type="number" placeholder="Enter rating[0-5]" value={this.state.rating} onChange={(event) => {
                            this.setState({
                                rating: event.target.value
                            })
                        }} />
                        <p>Job Index</p>
                        <input type="number" placeholder="Enter job Index" value={this.state.choosenIndex} onChange={(event) => {
                            this.setState({
                                choosenIndex: event.target.value
                            })
                        }} />
                        <button type="submit" onClick={(event) => {
                            event.preventDefault();
                            if (this.state.rating == -1 || this.state.choosenIndex == -1) {
                                alert('Fill Fields First');
                            }
                            else if (this.state.results.length <= this.state.choosenIndex || this.state.rating > 5 || this.state.choosenIndex < 0 || this.state.rating < 0) {
                                alert('Invalid Selection');
                            }
                            else {
                                axios.post('http://localhost:5000/rateJob', { jobId: this.state.results[this.state.choosenIndex]['dd']['_id'], hash: localStorage.getItem('hash'), rating: this.state.rating })
                                    .then((response) => {
                                        alert(response.data.message);
                                    })
                                    .catch((err) => {
                                        alert(err);
                                    })
                            }
                        }}>Rate!</button>
                    </div>
                </Jumbotron>
            </div >
        );
    }
}
