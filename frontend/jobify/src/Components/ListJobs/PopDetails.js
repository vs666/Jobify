import React from 'react';
import './Pop.css'
import axios from 'axios';
export default class Popup extends React.Component{
    constructor(props){
        super(props);
        this.jobId = props.jobId;
        this.applicant = props.applicant;
        this.sop = props.sop;
        this.loadData()
    }
    loadData(){
        
    }
    
    render(){
        return(
            <div className="popup-box">
                <div className="box">
                    <p>Job ID : {this.jobId}</p>
                </div>
                <button onClick={this.props.closePopup}>OK</button>
            </div>
        )
    }
}