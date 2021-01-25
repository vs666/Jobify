// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Table, Col, Jumbotron, Label, Card } from 'react-bootstrap';

export default class FSign extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            userhash: '',
            usertype: 'Applicant',
            password: '',
            namesake: '',
            bios: '',
            CollegeName: '',
            StartYear: '',
            EndYear: '',
            Skills: '',
            Rating: '',
            contact: '',
            isnew: true,
            selection: '1',
            skills: ['', 'C', 'C++', 'Java', 'JavaScript', 'Python', 'Ruby', 'x86_64', 'Kotlin', 'Swift', 'Html', 'CSS', 'SQL', 'MongoDB'],
        }
        this.skills_req = []
        this.collegeDetails = []
        if (localStorage.getItem('hash') != null && localStorage.getItem('hash') != 'Guest') {
            alert('Please logout first');
            window.location.href = '/logout';
        }

    }

    componentDidMount() {
        if (this.state.selection == '1') {
            var helt = ''
            for (let x = 0; x < this.state.skills.length; x++) {
                helt = helt + '<option value=\"' + this.state.skills[x] + '\">' + this.state.skills[x] + '</option>';
            }
            document.getElementById('skillset').innerHTML = helt;
        }
    }
    async deff() {

        var helt = ''
        for (let x = 0; x < this.state.skills.length; x++) {
            helt = helt + '<option value=\"' + this.state.skills[x] + '\">' + this.state.skills[x] + '</option>';
        }
        document.getElementById('skillset').innerHTML = helt;

    }

    initF(selection) {


        if (selection == null || (selection.toString() != '1' && selection.toString() != '2')) {
            alert('Please enter a valid choice');
            window.location.href = '/';
        }
        else {
            this.state.isnew = true;
        }
        if (selection.toString() == '2') {
            this.state.usertype = 'Recruiter';
        }
        else if (selection.toString() == '1') {
            this.state.usertype = 'Applicant';
        }
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

    // Render form based on the user type  
    render() {
        var login = (event) => {
            event.preventDefault();
            console.log('Done');
            alert(this.state.usertype)
            var data = {};
            if (this.state.selection == '1')
                data = {
                    Email: this.state.email.toString(),
                    Password: this.state.password.toString(),
                    Usertype: this.state.usertype.toString(),
                    Name: this.state.namesake.toString(),
                    Bio: this.state.bios.toString(),
                    College: this.collegeDetails,
                    Skills: this.skills_req,
                    hash: null
                };
            else {
                data = {
                    Contact: this.state.contact.toString(),
                    Name: this.state.namesake.toString(),
                    Email: this.state.email.toString(),
                    Password: this.state.password.toString(),
                    Usertype: this.state.usertype.toString(),
                    Bio: this.state.bios.toString(),
                    hash: null
                }
            }
            console.log(data)
            axios.post('http://localhost:5000/signIn', data)
                .then((response) => {
                    console.log(response);
                    if (response.data.stat.toString() == 'Error') {
                        alert("Login failed\n" + response.data.message);
                    }
                    else {
                        alert("Login Successful.\n" + response.data.message);
                        // session store the login data
                        console.log(response.data)
                        localStorage.setItem('hash', response.data.userhash.toString());
                        localStorage.setItem('type', response.data.usertype);
                        localStorage.setItem('usertype', response.data.usertype);
                        // window.location.href = '/';
                    }
                })
                .catch(err => {
                    alert(err);
                });
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

        const addColl = (event) => {
            event.preventDefault();
            var dat = {
                Name: this.state.CollegeName,
                startYear: this.state.StartYear,
                endYear: this.state.EndYear == '' ? 'Ongoing' : this.state.EndYear
            }
            this.collegeDetails.push(dat);
            var inH = '<tr><td>' + this.state.CollegeName + '</td><td>' + this.state.StartYear + '</td><td>' + (this.state.EndYear == '' ? 'Ongoing' : this.state.EndYear) + '</td></tr>';
            document.getElementById('elt-idpid').innerHTML += inH;
            this.setState({
                CollegeName: '',
                StartYear: '',
                EndYear: ''
            })
        }


        return (
            <div>

                <select value={this.state.selection} style={{ marginTop: '10vh' }} onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                        selection: event.target.value
                    });
                    this.setState({
                        usertype: event.target.name
                    });
                    if(event.target.value == "1"){
                        window.location.href = '/signup';
                    }
                }}>
                    <option value="1" name="Applicant">Applicant</option>
                    <option value="2" name="Recruiter">Recruiter</option>
                </select>
                <div>

                    {
                        (this.state.selection == '1') && <div style={{ marginTop: '10%', marginLeft: '20%', marginRight: '20%' }}>
                            <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                                <Form id="LoginForm" method="post" onSubmit={login}>
                                    <Form.Row>

                                        <Form.Group as={Col} controlId="formGridEmail" onChange={
                                            (event) => {
                                                if (this.state.isnew) {
                                                    this.setState({
                                                        email: event.target.value
                                                    })
                                                }
                                            }
                                        }> {/** un-editable for now */}
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
                                        <Form.Group as={Col} controlId="formGridName" onChange={(event) => { this.setState({ namesake: event.target.value }); }}>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Name" value={this.state.namesake} />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
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
                                    <Form.Group as={Col} controlId="formGridZip" onChange={(event) => { this.setState({ bios: event.target.value }); }}>
                                        <Form.Label>BIO</Form.Label>
                                        <Form.Control as="textarea" rows={4} value={this.state.bios} />
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Submit
                        </Button>

                                </Form>
                            </Jumbotron>
                        </div >
                    }
                    {
                        (this.state.selection != '1') && <div style={{ marginTop: '10%', marginLeft: '20%', marginRight: '20%' }}>
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
                    }
                </div>
            </div>
        );
    }
}
