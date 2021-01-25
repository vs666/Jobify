// use of props here
import axios from 'axios';
import React, { Component } from 'react';
import { Button, Form, Table, FormGroup, Col, Jumbotron, Label, Card } from 'react-bootstrap';
import Popup from './PopDetails';
export default class AcceptedList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order: 1,
        }
        this.results = []

    }

    componentDidMount() {
        this.ff1(this)
    }

    async ff1(sts) {
        // localStorage.setItem('temp', 'blah');
        var self = this;
        var dat = {
            Hash: localStorage.getItem('hash'),
        }

        await axios.post('http://localhost:5000/acceptedApplicants', dat)
            .then(response => {
                console.log('Accepted Applicants are :: ', response.data)
                this.results = JSON.parse(response.data.obj)
            })
            .catch((err) => {
                console.log(err);
            });
        // this.setState({
        //     results: JSON.parse(res)
        // });
        console.log(this.results, 'res')
        var ih = '';
        for (let x = 0; x < this.results.length; x++) {
            let J_Title = this.results[x]['job']['Title'];
            let AppName = this.results[x]['user']['Name'];
            let Rating = 0;
            // let Rating = (this.results[x]['user']['Votes']['count'] == 0 ? 'Unrated' : this.results[x]['user']['Votes']['count']);
            let Duration = this.results[x]['job']['Duration'] + " months";
            let Salary = this.results[x]['job']['Salary'];
            let Type = this.results[x]['job']['JobType'];

            ih += '<tr><td>' + J_Title + '</td><td>' + AppName + '</td><td>' + Rating + '</td><td>' + Duration + '</td><td>' + Salary + '</td><td>' + Type + '</td></tr>';
        }

        document.getElementById('zero').innerHTML = ih;

    }


    // Render form based on the user type  
    render() {



        var sortByProperty = (property, ind) => {
            return function (a, b) {
                if (a[property] > b[property])
                    return ind;
                else if (a[property] < b[property])
                    return (-1 * ind);
                return 0;
            }
        }


        var sortAndPlace = (cate) => {
            this.setState({
                results: this.results.sort(sortByProperty(cate, this.state.order))
            });
            this.setState({
                order: (-1 * this.state.order)
            })
            var nos = 1;
            console.log(this.results, 'new results')
            var ih = '';
            for (let x = 0; x < this.results.length; x++) {
                let J_Title = this.results['job']['Title'];
                let AppName = this.results['user']['Name'];
                let Rating = (this.results['user']['Votes']['count'] == 0 ? 'Unrated' : this.results['user']['Votes']['count']);
                let Duration = this.results['job']['Duration'] + " months";
                let Salary = this.results['job']['Salary'];
                let type = this.results['job']['Type'];

                ih += '<tr><td>' + J_Title + '</td><td>' + AppName + '</td><td>' + Rating + '</td><td>' + Duration + '</td><td>' + Salary + '</td><td>' + type + '</td></tr>';

            }
            alert('sorted');
            document.getElementById('zero').innerHTML = ih;
        }






        return (
            <div style={{ marginTop: '10%' }}>
                <Jumbotron style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th onClick={
                                    (event) => {
                                        event.preventDefault();
                                        sortAndPlace('job.Title');
                                    }
                                }>Job Title</th>
                                <th onClick={
                                    (event) => {
                                        event.preventDefault();
                                        sortAndPlace('user.Name');
                                    }
                                }>Applicant Name</th>
                                <th onClick={
                                    (event) => {
                                        event.preventDefault();
                                        sortAndPlace('user.Count.Rating');
                                    }
                                }>Rating</th>
                                <th onClick={
                                    (event) => {
                                        event.preventDefault();
                                        sortAndPlace('job.Duration');
                                    }
                                }>Duration</th>
                                <th onClick={
                                    (event) => {
                                        event.preventDefault();
                                        sortAndPlace('job.Salary');
                                    }
                                }>Salary</th>
                                <th>Job Type</th>
                            </tr>
                        </thead>
                        <tbody id="zero" style={{ fontSize: '2vh' }}>
                        </tbody>
                    </Table>

                </Jumbotron>
            </div >

        );
    }
}
