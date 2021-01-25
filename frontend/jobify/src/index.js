// server code
import React from 'react';
import ReactDOM from 'react-dom';
// import { renderToString } from 'react-dom/server'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App';
// const express = require('express');
// const bp = require('body-parser');
// const router = express.Router();
// const app = express();
// const data1 = require('./database_main.json')
// var urlencodedParser = bp.urlencoded({ extended: false });

// import * as serviceWorker from './serviceWorker';

// router.get('/', (req, res) => {
//   res.send(renderToString(f1(),'text/html'));
// });


// ReactDOM.hydrate(<App />, document.getElementById('root'));

// localStorage.setItem('hash', 'Guest');
// localStorage.setItem('usertype', 'Applicant');

function f1() {

  return (
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')));

}

f1();
  // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });