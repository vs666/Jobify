import logo from './logo.svg';
import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import './App.css';

import SignUp from './Components/SignUp/SignUp';
import Dash from './Components/Dashboard/Dash';
import Login from './Components/LoginPage/Login';
import Navigation from './Components/NavB/Navigation';
import FSign from './Components/SignUp/FSign';
import Logout from './Components/LoginPage/Logout';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err))
    console.log(this.state.data);
  }

  callBackendAPI = async () => {
    const response = await fetch('localhost:5000/');
    const body = await response.json();

    if (response.status !== 200) {
      console.log("Server is down.")
      throw Error(body.message)
    }
    else {
      console.log("Server is up.")
    }
    return body;
  };

  logoutFunc = () => {
    // localStorage.removeItem('hash');
    localStorage.removeItem('hash')
  }

  render() {
    return (
      <div className="App">
        <Navigation />
        <header className="App-header">
          <BrowserRouter>
            <Route exact path="/" >
            </Route>

            <Route path="/login">
              <Login />
            </Route>
            <Route path="/dashboard">
              <Dash />
            </Route>
            <Route path="/edit/dashboard">
              <SignUp hash={localStorage.getItem('hash')} type={localStorage.getItem('type')}/>
            </Route>
            <Route path="/editDetails">
              <SignUp email={''} userhash={localStorage.getItem('hash')} />
            </Route>
            <Route path="/signUp">
              <FSign userhash={localStorage.getItem('hash')} />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/">
            </Route>
          </BrowserRouter>
        </header>
      </div>
    );
  }
}


export default App;
