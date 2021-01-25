// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, Jumbotron, Label, Card } from 'react-bootstrap';

export default class ListJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hash: localStorage.getItem('hash'),  // not update
            title: '',
            appLimit: '',
            appCount: 0,     // not update
            postDate: '',    // not update
            deadline: '',
            type: "Full-Time",
            maxPos: '',
            duration: '',
            salary: '',
            rating: '0',      // not update
            tempSkill: '',
            skills: ['', 'C', 'C++', 'Java', 'JavaScript', 'Python', 'Ruby', 'x86_64', 'Kotlin', 'Swift', 'Html', 'CSS', 'SQL', 'MongoDB'],
        }
        this.skills_req = []

    }
    componentDidMount() {
        var helt = ''
        for (let x = 0; x < this.state.skills.length; x++) {
            helt = helt + '<option value=\"' + this.state.skills[x] + '\">' + this.state.skills[x] + '</option>';
        }
        document.getElementById('skillset').innerHTML = helt;
    }

    checkInt(str) {
        return !isNaN(str);
    }

    // Render form based on the user type  
    render() {


        var postJob = (event) => {
            // axios call to db goes here
            event.preventDefault();
            var data = {
                Hash: this.state.hash,
                Title: this.state.title,
                Deadline: this.state.deadline,
                Vaccancies: parseInt(this.state.maxPos),
                Limit: parseInt(this.state.appLimit),
                SkillsRequired: this.skills_req,
                Type: this.state.type,
                Current: 0,
                Duration: parseInt(this.state.duration),
                Salary: parseInt(this.state.salary),
                Rating: 0,
            }
            console.log('Ding');
            console.log(data);
            axios.post('http://localhost:5000/addJob', data)
                .then((response) => {
                    if (response.data.stat == 'Success') {
                        alert(response.data.message);
                    }
                    else {
                        console.log(response.data.message)
                    }
                    window.location.href = '/dashboard'
                })
                .catch((error) => {
                    alert(error);
                    window.location.href = '/dashboard'
                })
        }
        const addSkill = (event) => {
            event.preventDefault();
            var sk = prompt("Add skill")
            if (sk != null) {
                let found = false;
                for (let i = 0; i < this.skills_req.length; i++) {
                    if (this.skills_req[i] == sk) {
                        found = true;
                    }
                }
                if (!found) {
                    // alert(sk)
                    this.skills_req.push(sk);
                    var tad = '';
                    for (let i = 0; i < this.skills_req.length; i++) {
                        if (i != 0) {
                            tad = tad + ',' + this.skills_req[i]
                        } else {
                            tad = this.skills_req[i]
                        }
                    }
                    document.getElementById('printskills').innerHTML = tad;
                }
                else {
                    alert('Already Selected this skill')
                }
            } else {
                alert('Unable to add skill')
            }
        }
        const ddSkillAdd = (event) => {
            event.preventDefault()
            let found = false;
            for (let i = 0; i < this.skills_req.length; i++) {
                if (this.skills_req[i] == this.state.tempSkill) {
                    found = true;
                }
            }
            if (!found) {
                // alert(this.state.tempSkill)
                this.skills_req.push(this.state.tempSkill);
                var tad = '';
                for (let i = 0; i < this.skills_req.length; i++) {
                    if (i != 0) {
                        tad = tad + ',' + this.skills_req[i]
                    } else {
                        tad = this.skills_req[i]
                    }
                }
                document.getElementById('printskills').innerHTML = tad;
            }
            else {
                alert('Already Selected this skill')
            }
            console.log('Skills are', this.state.skills_req)
        }

        return (
            <div style={{ marginTop: '10%', marginLeft: '20%', marginRight: '20%' }}>
                <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    {/* Form goes here */}

                    <Form method="post" onSubmit={postJob}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail" onChange={(event) => {
                                this.setState({
                                    title: event.target.value
                                });
                            }}>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter Job Title" value={this.state.title} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridPassword" onChange={(event) => {
                                this.setState({
                                    deadline: event.target.value
                                });
                            }}>
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control type="date" placeholder="DD/MM/YYYY" value={this.state.deadline} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword" onChange={(event) => {
                                this.setState({
                                    appLimit: event.target.value
                                });
                            }}>
                                <Form.Label>Applicant Limit</Form.Label>
                                <Form.Control type="number" placeholder="" value={this.state.appLimit} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridAddress1" onChange={(event) => {
                                this.setState({
                                    skills_req: event.target.value
                                });
                            }}>
                                <Form.Label>Skills Required</Form.Label>
                                <p id="printskills" style={{ fontSize: 'medium' }}>No Skills Selected</p>
                                <select id="skillset" style={{ margin: '2%' }} value={this.state.tempSkill} onChange={(event) => { this.setState({ tempSkill: event.target.value }) }}>
                                    {/* <option value="fulltime">Full-Time</option>
                                    <option value="parttime">Part-Time</option>
                                    <option value="wfh">Work From Home</option> */}
                                </select>
                                <Button type="submit" onClick={ddSkillAdd}
                                    style={{ margin: '2%' }}>Add</Button>
                                <Button onClick={addSkill} type="submit" style={{ marginTop: '2%' }} >Add Custom Skill</Button>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridState" onChange={(event) => {
                                this.setState({
                                    type: event.target.value
                                });
                            }}>
                                <Form.Label>Job Type</Form.Label>
                                <select onChange={(event) => { this.setState({ type: event.target.value }) }} value={this.state.type} >
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Work From Home">Work From Home</option>
                                </select>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Vaccancies</Form.Label>
                                <Form.Control type="number" placeholder="Vaccancies" value={this.state.maxPos} onChange={(event) => { this.setState({ maxPos: event.target.value }) }} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridPassword" onChange={(event) => {
                                this.setState({
                                    salary: event.target.value
                                });
                            }}>
                                <Form.Label>Salary</Form.Label>
                                <Form.Control type="number" placeholder="in INR" value={this.state.salary} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridCity" onChange={(event) => {
                                this.setState({
                                    duration: event.target.value
                                });
                            }}>
                                <Form.Label>Duration</Form.Label>
                                <Form.Control type="number" placeholder="in months" value={this.state.duration} />
                            </Form.Group>
                        </Form.Row>


                        <Button variant="primary" type="submit">
                            Post Job
                        </Button>
                    </Form>
                </Jumbotron>
            </div >

        );
    }
}
