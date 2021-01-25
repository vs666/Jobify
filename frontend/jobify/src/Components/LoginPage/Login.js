import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Card } from 'react-bootstrap';
import axios from 'axios';
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            userhash: localStorage.getItem('hash')
        }
    }




    handleChange = (event) => {
        const target = event.target;
        const field = target.name;
        const value = target.value;



        this.setState({
            [field]: value
        });
    }

    render() {
        var login = (event) => {
            event.preventDefault();
            var data = { hash: (localStorage.getItem('hash')==undefined || localStorage.getItem('hash')==null?'Guest':localStorage.getItem('hash')), email: this.state.email, password: this.state.password };
            console.log(data);

            // Server side communication here
            console.log(data);
            axios.post('http://localhost:5000/login', data)
                .then((response) => {
                    if (response.data.stat == 'Success') {
                        console.log(response.data);
                        localStorage.setItem('hash', response.data.userhash);
                        localStorage.setItem('type', response.data.usertype);
                        localStorage.setItem('usertype', response.data.usertype);
                        alert('Login Successful');
                        // window.location.href = '/dashboard';
                    }
                    else {
                        alert('Login Failed');
                    }
                })
                .catch((error) => {
                    alert(error.message);
                })

        }
        return (
            <div>
                <div className="container" style={{ marginTop: '10%', width: '40%', height: '20%', marginLeft: '60%' }}>
                    <Card style={{ width: '18rem', backgroundColor: '#078' }}>
                        <Card.Body>

                            <Form style={{ fontSize: '80%' }} method="post" onSubmit={login}>
                                <Form.Group controlId="formBasicEmail" >
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" validations={['required', 'isEmail']} name="email" id="email" value={this.state.email} onChange={
                                        (event) => {
                                            this.setState({ email: event.target.value });
                                        }
                                    } placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password"
                                        type="password"
                                        validations={['required']}
                                        name="password"
                                        value={this.state.password}
                                        onChange={
                                            (event) => {
                                                this.setState({
                                                    password: event.target.value
                                                });
                                            }
                                        }
                                        id="password"
                                        placeholder="Enter your password."
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" >
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>

        );
    }
}
