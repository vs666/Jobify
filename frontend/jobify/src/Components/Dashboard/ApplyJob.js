// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, FormGroup, Col, Jumbotron, Label, Card } from 'react-bootstrap';

export default class ApplyJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: -1,
            sop: '',
            sop_length: 0,
            password: '',
            namesake: '',
            bios: '',
            CollegeName: '',
            StartYear: '',
            EndYear: '',
            Skills: '',
            Rating: '',
            contact: '',
            isnew: false,
        }
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
            var data = {
                email: this.state.email.toString(),
                password: this.state.password.toString(),
                usertype: this.state.usertype.toString(),
                name: this.state.namesake.toString(),
                bio: this.state.bios.toString(),
                collegeName: this.state.CollegeName.toString(),
                startYear: this.state.StartYear.toString(),
                endYear: this.state.EndYear.toString(),
                skills: this.state.Skills.toString(),
                rating: this.state.Rating.toString(),
                contact: this.state.contact.toString(),
                hash1: 'Guest'
            };
            
            axios.post('http://localhost:5000/signIn', data)
            .then((response) => {
                console.log(response);
                if (response.data.stat.toString() == 'Error') {
                    alert("Login failed\n" + response.data.message);
                }
                else {
                    alert("Login Successful.\n" + response.data.message);
                    // session store the login data
                    localStorage.setItem('hash', response.data.userhash);
                    localStorage.setItem('type', response.data.usertype);
                    window.location.href = '/';
                }
            })
            .catch(err => {
                alert(err);
            });
        }
        
        const textAreaChange = (event)=> {
            if (this.state.sop_length < 250) {
                this.setState({
                    sop: event.target.value
                });
                this.setState({
                    sop_length: this.state.sop.length
                });
            }
            else if (event.target.value.toString().length < 250) {
                this.setState({
                    sop: event.target.value
                });
                this.setState({
                    sop_length: this.state.sop.length
                });
            }
        }
        
        return (
            <div style={{ marginTop: '10%', marginLeft: '20%', marginRight: '20%' }}>

                <p style={{ backgroundColor: 'rgba(0,255,0,0.65)' }}>Apply Now</p>
                <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <Form id="LoginForm" method="post" onSubmit={login}>
                        <Form.Row style={{ backgroundColor: 'rgba(100,0,100,0.6)' }}>

                            <Form.Group as={Col} controlId="formGridEmail"
                                style={{ marginLeft: '25%', marginRight: '25%' }}
                                onChange={
                                    (event) => {
                                        if (this.state.isnew) {
                                            this.setState({
                                                email: event.target.value
                                            })
                                        }
                                    }
                                }> {/** un-editable for now */}
                                <Form.Label>Job #</Form.Label>
                                <Form.Control type="number" placeholder="Enter Job #" value={this.state.email} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row style={{ backgroundColor: 'rgba(100,0,150,0.6)', marginTop: '10%' }}>
                            <Form.Group as={Col} controlId="formGridZip" onChange={(event) => { this.setState({ bios: event.target.value }); }}>
                                <Form.Label>Statement of Purpose</Form.Label>
                                <p style={{ fontSize: '60%' }}>Max 250 words</p>
                                <Form.Control as="textarea" maxlength="10" rows={4} value={this.state.sop} onChange={textAreaChange} />
                            </Form.Group>

                        </Form.Row>

                        <Button variant="primary" type="submit" style={{marginTop:'5%'}}>
                            Submit
                        </Button>

                    </Form>
                </Jumbotron>
            </div >

        );
    }
}
