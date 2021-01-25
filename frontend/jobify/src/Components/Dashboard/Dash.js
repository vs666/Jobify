import React, { Component } from 'react';
import axios from 'axios';
import Parser from 'html-react-parser';
import { Link } from 'react-router-dom';
import { Button, Form, Card, Tabs, Tab, ListGroup, ListGroupItem, Image, Text, InputGroup, Jumbotron, Container, FormControl, Table, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import './Dash.css';
import ShowList from './../ListJobs/ShowList';
import ListJobs from './../ListJobs/LJobs';
import SearchBox from './../SearchPane/Search';
import ApplyJob from './ApplyJob';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import Uppy from './../Upload/UFile';
import AcceptedList from './../ListJobs/Accepted';

export default class Dash extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'Guest',
            authHash: '',
            description: 'A small Description of yourself',
            table: '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
            jobtype: 'Any Type',
            searchQuery: '',
            duration: 1000,
            salaryUl: 10000,
            salaryLl: 0,
            details: { name: 'Guest User', email: 'noreply@example.com', college: 'IIIT Hyderabad', college_start: 'July 2019', college_end: '', skills: 'C, C++, ReactJs, NodeJs, Express, Python' },  // Details Dictionary
        }

        this.tabData = []
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
            this.setState({
                username: response.data.Name,
                description: response.data.Bio,
                details: response.data
            });
        }
        if (localStorage.getItem('type') == 'Applicant' && localStorage.getItem('hash') != null && localStorage.getItem('hash') != undefined) {
            var n = '';
            for (let x = 0; x < this.state.details['College'].length; x++) {
                n = n + ' ' + this.state.details['College'][x]['Name'] + ' (from  ' + this.state.details['College'][x]['startYear'] + ' to ' + this.state.details['College'][x]['endYear'] + ')</br>'
            }
            document.getElementById('study').innerHTML = n;
            n = 'Skills : ';
            for (let x = 0; x < this.state.details['Skills'].length; x++) {
                n = n + (x == 0 ? ' ' : ',') + this.state.details['Skills'][x];
            }

            document.getElementById('skillid').innerHTML = n;
        }
    }


    login = (event) => {

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

    render() {
        var self = this;
        var updateTable = (event) => {
            var tm;
            event.preventDefault()
            var data = {
                Hash: localStorage.getItem('hash')
            }
            axios.post('http://localhost:5000/showApplications', data)
                .then((response) => {
                    if (response.data.stat == "Success") {
                        // do all work here :sad
                        var ihs = '';
                        for (let x = 0; x < response.data.dada.length; x++) {
                            ihs = ihs + '<tr><td>' + (x + 1) + '</td><td>' + response.data.dada[x]['ud']['Title'] + '</td><td>' + response.data.dada[x]['ud']['Recruiter']['Name'] + '</td><td>' + response.data.dada[x]['ud']['Votes']['Rating']/(response.data.dada[x]['ud']['Votes']['count']==0?1:response.data.dada[x]['ud']['Votes']['count']) + '</td><td>' + response.data.dada[x]['ud']['Salary'] + '</td><td>' + response.data.dada[x]['ud']['Duration'] + " months" + '</td><td>' + (response.data.dada[x]['ud']['Deadline'] + "").substring(0, 10) + '</td><td>' + response.data.dada[x]['jd']['Status'] + '</td></tr>'
                        }
                        document.getElementById('app-data').innerHTML = ihs;

                    }
                    else {
                    }
                })
                .catch((error) => {
                    console.log(error, 'Error');
                });
        }

        if (localStorage.getItem('type') == 'Applicant') {

            return (
                <div style={{ paddingTop: '3vh', paddingRight: '2vh' }}>
                    <p className="top-tag" style={{ textAlign: 'right' }}>{this.state.username}</p>
                    <div>
                        <Jumbotron style={{ marginLeft: '5vh', marginRight: '5vh', color: 'black', backgroundColor: 'rgba(190,190,255,0.5)' }}>
                            <Col xs={6} md={4}>
                                <Image src={"http://localhost:5000/dp/?Hash="+localStorage.getItem('hash')} style={{width:'25vh',height:'25vh', marginLeft:'50%'}} rounded />
                            </Col>
                            <h1>Hello, {this.state.username}!</h1>
                            <p>
                                {this.state.description}
                            </p>
                            <p>
                                <Link to="/edit/dashboard" style={{ color: '#055' }}>Edit Details</Link>
                            </p>
                        </Jumbotron>

                    </div>
                    <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" >
                        <Tab class="tabcus" eventKey="details" title="Details" >

                            <div style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.3', paddingLeft: '5vh', paddingTop: '4vh' }}>
                                <p>Name : {this.state.details['Name']}</p>
                                {/* <p>Email : {this.state.details['EmailID']}</p> */}
                                <p>Institution Name : </p>
                                <p id="study"></p>
                                <p id="skillid">Skills : {this.state.details['Skills']}</p>

                                <div style={{ fontSize: 'smaller', marginLeft: '40%', marginTop: '10%' }}>
                                    <p style={{ marginLeft: '15%' }}>Image/CV upload</p>
                                    <Uppy></Uppy>
                                </div>
                                {/* Code for image here */}

                            </div>

                        </Tab>
                        <Tab class="tabcus" eventKey="searchJobs" title="Search for Jobs" >
                            <SearchBox />
                            {/* <ApplyJob /> */}
                        </Tab>
                        <Tab class="tabcus" eventKey="contact" title="My Applications">
                            <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3' }}>
                                <p>My Applications</p>
                                <Button type="success" onClick={updateTable}>Reload</Button>
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
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody id="app-data">
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
        else if (localStorage.getItem('type') == 'Recruiter') {
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
                                <Link to="/edit/dashboard" style={{ color: '#055' }}>Edit Details</Link>
                            </p>
                        </Jumbotron>

                    </div>
                    <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" >
                        <Tab class="tabcus" eventKey="details" title="Details" >

                            <div style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.3', paddingLeft: '5vh', paddingTop: '4vh' }}>
                                <p>Name : {this.state.details['Name']}</p>
                                <p>Email : {this.state.details['Email']}</p>
                                <p>Email : {this.state.details['Contact']}</p>
                                {/* Code for image here */}
                            </div>
                        </Tab>
                        <Tab class="tabcus" eventKey="postJobs" title="Post Jobs">
                            <Container>
                                <ListJobs />
                            </Container>
                        </Tab>
                        <Tab class="tabcus" eventKey="showPostings" title="My Postings">
                            <Container>
                                <ShowList />
                            </Container>
                        </Tab>
                        <Tab class="tabcus" eventKey="showSelected" title="Accepted Applicants">
                            <AcceptedList/>
                        </Tab> 
                    </Tabs>
                </div >

            );

        }
        else {
            // do nothing
        }
    }
}
