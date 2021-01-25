import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Card } from 'react-bootstrap';
import axios from 'axios';
export default class Logout extends Component {

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
        if (this.state.userhash == null || this.state.userhash == undefined || this.state.userhash == 'Guest') {
            alert('Please login first.');
            window.location.href = '/';
        }
        var logout = (event) => {
            event.preventDefault();
            localStorage.removeItem('hash');
            window.location.href = '/';
        }
        return (
            <div>
                <div className="container" style={{ alignItems: 'center' }}>
                    <Card style={{ width: '40rem', backgroundColor: 'rgba(10,10,10,0.3)', marginTop: '10vh' }}>
                        <Card.Body>

                            <Form style={{ fontSize: '80%' }} method="post" onSubmit={logout}>
                                <Button variant="primary" type="submit" >
                                    Logout
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>

        );
    }
}
