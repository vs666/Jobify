// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, Table, Jumbotron, Label, Card } from 'react-bootstrap';

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // inherit all properties from parent
            email: '',
            hash: props.hash,
            type: props.type,
            name: '',
            bio: '',
            contact: '',
            CollegeName: '',
            StartYear: '',
            EndYear: '',
            tempSkill: '',
            skills: ['', 'C', 'C++', 'Java', 'JavaScript', 'Python', 'Ruby', 'x86_64', 'Kotlin', 'Swift', 'Html', 'CSS', 'SQL', 'MongoDB'],
        }
        this.College = [] // Array
        this.Skills = []   // Array

    }

    componentDidMount() {
        this.ff1()
    }
    async ff1() {
        console.log('here', localStorage.getItem('hash'))
        const response = await axios.get('http://localhost:5000/attainData', {
            params: {
                hash: localStorage.getItem('hash'),
                type: localStorage.getItem('type'),
            }
        })
        console.log('rd', response.data)
        if (response.data != null && response.data.Hash != 'Guest') {
            if (this.state.type == 'Applicant') {
                this.setState({
                    name: response.data.Name,
                    bio: response.data.Bio,
                    email: response.data.Email,
                });
                this.College = response.data.College
                this.Skills = response.data.Skills
            }
            else {
                this.setState({
                    email: response.data.Email,
                    name: response.data.Name,
                    bio: response.data.Bio,
                    contact: response.data.Contact
                })
            }
        }


        if (this.state.type == 'Applicant') {
            var inH = '';
            for (let x = 0; x < this.College.length; x++) {
                inH += '<tr><td>' + this.College[x]['Name'] + '</td><td>' + this.College[x]['startYear'] + '</td><td>' + (this.College[x]['endYear'] == '' ? 'Ongoing' : this.College[x]['endYear']) + '</td></tr>';
            }
            document.getElementById('elt-idpid').innerHTML = inH;
            var helt = ''
            var tad = '';
            for (let x = 0; x < this.state.skills.length; x++) {
                helt = helt + '<option value=\"' + this.state.skills[x] + '\">' + this.state.skills[x] + '</option>';
            }
            for (let x = 0; x < this.Skills.length; x++) {
                tad = tad + (x == 0 ? '' : ',') + this.Skills[x];
            }
            document.getElementById('skillset').innerHTML = helt;
            document.getElementById('printskills').innerHTML = tad;
        }
        console.log(this.state.details);
    }


    checkInt(str) {
        console.log('String is ' + str);
        return !isNaN(str);
    }

    // Render form based on the user type  
    render() {

        var login = (event) => {
            event.preventDefault();
            console.log('Done');
            var data = {};
            if (this.state.type == 'Applicant')
                data = {
                    type: this.state.type.toString(),
                    name: this.state.name.toString(),
                    bio: this.state.bio.toString(),
                    college: this.College,
                    skills: this.Skills,
                    hash: this.state.hash
                };
            else {
                data = {
                    contact: this.state.contact,
                    name: this.state.name,
                    type: this.state.type,
                    bio: this.state.bios,
                    hash: this.state.hash
                }
            }
            console.log(data)
            axios.post('http://localhost:5000/updateUser', data)
                .then((response) => {
                    console.log(response);
                    if (response.data.stat.toString() == 'Error') {
                        alert("Login failed : " + response.data.message);
                    }
                    else {
                        alert("Update Successful. : " + response.data.message);
                        window.location.href = '/dashboard';
                    }
                })
                .catch(err => {
                    alert(err);
                });
        }

        const ddSkillAdd = (event) => {
            event.preventDefault()
            let found = false;
            for (let i = 0; i < this.Skills.length; i++) {
                if (this.Skills[i] == this.state.tempSkill) {
                    found = true;
                }
            }

            if (!found) {
                this.Skills.push(this.state.tempSkill);
                var tad = '';
                for (let i = 0; i < this.Skills.length; i++) {
                    if (i != 0) {
                        tad = tad + ',' + this.Skills[i]
                    } else {
                        tad = this.Skills[i]
                    }
                }
                document.getElementById('printskills').innerHTML = tad;
            }
            else {
                alert('Already Selected this skill')
            }
            console.log('Skills are', this.state.skills_req)
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
                    alert(sk)
                    this.Skills.push(sk)
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

        const addColl = (event) => {
            event.preventDefault();
            var dat = {
                Name: this.state.CollegeName,
                startYear: this.state.StartYear,
                endYear: this.state.EndYear == '' ? 'Ongoing' : this.state.EndYear
            }
            this.College.push(dat);
            var inH = '<tr><td>' + this.state.CollegeName + '</td><td>' + this.state.StartYear + '</td><td>' + (this.state.EndYear == '' ? 'Ongoing' : this.state.EndYear) + '</td></tr>';
            document.getElementById('elt-idpid').innerHTML += inH;
            this.setState({
                CollegeName: '',
                StartYear: '',
                EndYear: ''
            })
        }

        if (this.state.type == 'Applicant') {
            return (
                <div style={{ marginTop: '10%', marginLeft: '20%', marginRight: '20%' }}>
                    <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <Form id="LoginForm" method="post" onSubmit={login}>
                            <Form.Row>

                                <Form.Group as={Col} controlId="formGridName" onChange={(event) => { this.setState({ name: event.target.value }); }}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name" value={this.state.name} />
                                </Form.Group>
                                <Form.Group controlId="formGridCollege" style={{ paddingRight: '2vh' }} onChange={
                                    (event) => {
                                        this.setState({
                                            CollegeName: event.target.value
                                        })
                                    }
                                }>
                                    <Form.Label>College Name</Form.Label>
                                    <Form.Control type="text" placeholder="College Name" value={this.state.CollegeName} />
                                </Form.Group>

                                <Form.Group controlId="formGridStartYear" style={{ marginLeft: '1vh' }} onChange={
                                    (event) => {
                                        this.setState({ StartYear: event.target.value })
                                    }
                                }>
                                    <Form.Label>Start Year</Form.Label>
                                    <Form.Control type="date" placeholder="DD-MM-YYYY" value={this.state.StartYear} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEndYear" style={{ marginRight: '5%' }} onChange={(event) => { this.setState({ EndYear: event.target.value }); }}>
                                    <Form.Label>End Year</Form.Label>
                                    <Form.Control type="date" placeholder="DD-MM-YYYY" value={this.state.EndYear} />
                                </Form.Group>
                                <Form.Group as={Col} style={{ paddingRight: '10%' }}>
                                    <Form.Label>Add College</Form.Label>
                                    <Button type="submit" onClick={addColl}>Add College</Button>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Table striped bordered hover variant="dark" responsive style={{ backgroundColor: 'rgba(50,50,50,0.6' }}>
                                    <thead>
                                        <tr>
                                            {/*Add onclick sort function*/}
                                            <th>College Name</th>
                                            <th>Start</th>
                                            <th>End</th>
                                        </tr>
                                    </thead>
                                    <tbody id="elt-idpid" >
                                        {/*  */}
                                    </tbody>

                                </Table>

                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridSkills" onChange={(event) => { this.setState({ Skills: event.target.value }); }}>
                                    <Form.Label>Skills</Form.Label>
                                    <p id="printskills" style={{ fontSize: 'medium' }}>No Skills Selected</p>
                                    <select id="skillset" style={{ margin: '2%' }} value={this.state.tempSkill} onChange={(event) => { this.setState({ tempSkill: event.target.value }) }}>
                                    </select>
                                    <Button type="submit" onClick={ddSkillAdd} style={{ paddingRight: '2%' }}>Add Skill</Button>
                                    <Button type="submit" onClick={addSkill} style={{ paddingRight: '2%' }}>Add Custom Skill</Button>
                                </Form.Group>

                            </Form.Row>
                            <Form.Group as={Col} controlId="formGridZip" onChange={(event) => { this.setState({ bio: event.target.value }); }}>
                                <Form.Label>BIO</Form.Label>
                                <Form.Control as="textarea" rows={4} value={this.state.bio} />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                        </Button>

                        </Form>
                    </Jumbotron>
                </div >

            );
        }
        else {
            return (
                <div style={{ marginTop: '10%', marginLeft: '20%', marginRight: '20%' }}>
                    <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <Form id="LoginForm" method="post" onSubmit={login}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridEmail" onChange={(event) => {
                                    if (this.state.isnew) {
                                        this.setState({
                                            email: event.target.value
                                        });
                                    }
                                }}> {/** un-editable for now */}
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={this.state.email} />
                                </Form.Group>

                                {
                                    this.state.isnew && <Form.Group as={Col} controlId="formGridPassword" onChange={(event) => {
                                        if (this.state.isnew) {
                                            this.setState({
                                                password: event.target.value
                                            });
                                        }
                                    }}> {/** un-editable for now */}
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" value={this.state.password} />
                                    </Form.Group>
                                }

                                <Form.Group as={Col} controlId="formGridName" onChange={(event) => {
                                    this.setState({ namesake: event.target.value });
                                }}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name" value={this.state.namesake} />
                                </Form.Group>

                                <Form.Group controlId="formGridContact" style={{ marginLeft: '1vh' }} onChange={
                                    (event) => {
                                        if (this.checkInt(event.target.value))
                                            this.setState({ contact: event.target.value })
                                        else
                                            alert('Invalid Character. Allowed values are [0-9] only.');
                                    }
                                }>
                                    <Form.Label>Contact Number</Form.Label>
                                    <Form.Control type="text" placeholder="XXXX-XXX-XXX" value={this.state.contact} />
                                </Form.Group>

                            </Form.Row>

                            <Form.Group as={Col} controlId="formGridZip" onChange={(event) => { this.setState({ bios: event.target.value }); }}>
                                <Form.Label>BIO</Form.Label>
                                <Form.Control as="textarea" rows={4} value={this.state.bios} />
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form>
                    </Jumbotron>
                </div>
            );
        }
    }
}
