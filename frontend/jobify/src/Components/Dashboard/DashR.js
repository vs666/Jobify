import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Card, Tabs, Tab, ListGroup, ListGroupItem, Image, Text, InputGroup, Jumbotron, Container, FormControl, Table, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './Dash.css';
export default class RDash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'Guest',
            authHash: '',
            description: 'A small Description of the Company',
            details: { name: 'Guest Recruiter', email: 'noreply@example.com', contact:'+0 394-234-3382' },  // Details Dictionary
            table: '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
            jobtype: 'Any Type',
            searchQuery: '',
            duration: 1000,
            salaryUl: 10000,
            salaryLl: 0
        }

        // this.state.details = loadDetailsFromServer
    }



    login = (event) => {
        if (this.state.userhash != 'Guest') {
            // update rest of information
            alert('Please sign in first');

            axios.post('/signIn/getData', { email: this.state.email, userhash: this.state.userhash, usertype: this.state.usertype })
                .then((res) => {

                })
        }
        else {
            console.log('Current user is guest');
        }

        event.preventDefault();

        const email = this.state.email;
        const pass = this.state.password;
        console.log(email, pass);
        var data = { username: email.toString(), password: pass.toString() };
        console.log(data);

        // Server side communication here

        console.log(email, pass);
    }

    handleChange = (event) => {
        const target = event.target;
        const field = target.name;
        const value = target.value



        this.setState({
            [field]: value
        });
    }
    handleSearchChange = (event) => {
        const target = event.target;
        const value = target.value

        this.setState({
            searchQuery: value
        });
    }
    searchField() {
        console.log('Searched Query is : ', this.state.searchQuery)

        // API Call and update table element here
    }
    updateTable() {
        console.log('Updating Applications Table')
    }

    render() {
        return (
            <div style={{ paddingTop: '3vh', paddingRight: '2vh' }}>
                <p className="top-tag" style={{ textAlign: 'right' }}>{this.state.username}</p>
                <div>
                    <Jumbotron style={{ marginLeft: '5vh', marginRight: '5vh', color: 'black', backgroundColor: 'rgba(190,190,255,0.5)' }}>
                        <h1>Hello, {this.state.username}!</h1>
                        <p>
                            {this.state.description}
                        </p>
                        <p>
                            <Link to="/editDetails" style={{ color: '#055' }}>Edit Details</Link>
                        </p>
                    </Jumbotron>

                </div>
                <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" >
                    <Tab class="tabcus" eventKey="details" title="Details" >

                        <div style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.3', paddingLeft: '5vh', paddingTop: '4vh' }}>
                            <p>Name : {this.state.details['name']}</p>
                            <p>Email : {this.state.details['email']}</p>
                            <p>Institution Name : {this.state.details['college']}</p>
                            <p>Start Year : {this.state.details['college_start']}</p>
                            <p>Graduation Year : {this.state.details['college_end']}</p>
                            <p>Skills : {this.state.details['skills']}</p>
                            <a href={this.state.details['resumeLink']}>Resume</a>   {/*implement this part */}
                            {/* Code for image here */}

                        </div>

                    </Tab>
                    <Tab class="tabcus" eventKey="searchJobs" title="Search for Jobs">
                        <Container>
                            <Jumbotron style={{ marginLeft: '5vh', marginRight: '5vh', color: '#055', backgroundColor: 'rgba(110,200,200,0.2)' }}>
                                <p style={{ fontFamily: 'Helvetica Neue', fontWeight: '800', fontSize: '5vh', color: 'black' }}>Searh for Jobs</p>
                                <Form inline onSubmit={this.searchField}>
                                    <FormControl type="text" placeholder="Search" value={this.state.searchQuery} onChange={this.handleSearchChange} className="mr-sm-2" />
                                    <DropdownButton
                                        as={InputGroup.Prepend}
                                        variant="success"
                                        title={this.state.jobtype}
                                        id="input-group-dropdown-1"
                                        style={{ padding: '1vh' }}
                                    >
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ jobtype: 'Full-Time' }) }}>Full-Time</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ jobtype: 'Part-Time' }) }}>Part-Time</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ jobtype: 'WorkFromHome' }) }}>WorkFromHome</Button></Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ jobtype: 'All Types' }) }}>Any Type</Button></Dropdown.Item>
                                    </DropdownButton>
                                    <DropdownButton
                                        as={InputGroup.Prepend}
                                        variant="success"
                                        title={((this.state.duration > 7) ? 'Duration invariant' : this.state.duration + ' months')}
                                        id="input-group-dropdown-1"
                                        style={{ padding: '1vh' }}
                                    >
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 1 }) }}>1 month</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 2 }) }}>2 months</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 3 }) }}>3 months</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 3 }) }}>4 months</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 3 }) }}>5 months</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 3 }) }}>6 months</Button></Dropdown.Item>
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 3 }) }}>7 months</Button></Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item><Button variant="light" size="lg" onClick={() => { this.setState({ duration: 1000 }) }}>Infinite</Button></Dropdown.Item>
                                    </DropdownButton>
                                    <InputGroup className="mb-3" >
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Max and Min Salary (in Rs.)</InputGroup.Text>
                                        </InputGroup.Prepend>

                                        <FormControl type="text" placeholder="Max Salary" value={this.state.salaryUl} onChange={(event) => { this.setState({ salaryUl: event.target.value }) }} />
                                        <FormControl type="text" placeholder="Min Salary" value={this.state.salaryLl} onChange={(event) => { this.setState({ salaryUl: event.target.value }) }} />
                                        <Button style={{ marginLeft: '2vh', paddingLeft: '2vh' }} variant="success" type="submit">GO</Button>
                                    </InputGroup>


                                </Form>
                                <div style={{ paddingTop: '3%' }}>
                                    <Table striped bordered hover variant="dark" style={{ backgroundColor: 'rgba(50,50,50,0.6' }}>
                                        <thead>
                                            <tr>
                                                {/*Add onclick sort function*/}
                                                <th>#</th>
                                                <th>Job Title</th>
                                                <th>Recruiter</th>
                                                <th>Rating</th>
                                                <th>Salary</th>
                                                <th>Duration</th>
                                                <th>Deadline of Application</th>
                                                <th>Apply Now</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Parser(this.state.table)}
                                        </tbody>
                                    </Table>
                                </div>
                            </Jumbotron>
                        </Container>
                    </Tab>
                    <Tab class="tabcus" eventKey="contact" title="My Applications">
                        <Jumbotron style={{ backgroundColor:'rgba(0,0,0,0.3'}}>
                            <p>My Applications</p>
                            <Button type="success" onClick={this.updateTable}>Reload</Button>
                            <div style={{ paddingTop: '3%' }}>
                                <Table striped bordered hover variant="dark" style={{ backgroundColor: 'rgba(50,50,50,0.6' }}>
                                    <thead>
                                        <tr>
                                            {/*Add onclick sort function*/}
                                            <th>#</th>
                                            <th>Job Title</th>
                                            <th>Recruiter</th>
                                            <th>Rating</th>
                                            <th>Salary</th>
                                            <th>Duration</th>
                                            <th>Deadline of Application</th>
                                            <th>Apply Now</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Parser(this.state.table)}
                                    </tbody>
                                </Table>
                            </div>
                        </Jumbotron>

                    </Tab>
                </Tabs>
            </div >

        );
    }
}
