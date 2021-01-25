import React from 'react';
import axios from 'axios';

class Uppy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            extension: '.pdf'
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('hash', localStorage.getItem('hash'))
        formData.append('ext', this.state.extension)
        formData.append('myfile', this.state.file);
        console.log(formData, 'Form Data ');
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("http://localhost:5000/upload", formData, config)
            .then((response) => {
                alert(response.data.message);
            }).catch((error) => {
            });
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
        console.log(e.target)
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit} style={{ marginRight: '40%' }}>
                <select onChange={
                    (event)=>{
                        event.preventDefault();
                        this.setState({
                            extension:event.target.value
                        })
                    }
                }>
                    <option value=".pdf">PDF</option>
                    <option value=".png">PNG</option>
                </select>
                {this.state.file == null ? 'Select a file':(this.state.file.originalname)}
                <label for="file-upload" class="custom-file-upload" style={{marginLeft:'3%',backgroundColor:'rgba(100,255,100,0.8)', width:'30%', borderWidth:'0.5%',borderStyle:'solid',borderRadius:'10px', borderColor:'rgba(100,255,100,0.8)'}}>
                    <input id="button" type="file" className="custom-file-input" name="myImage" onChange={this.onChange}/>
                </label>
                <button className="upload-button" type="submit" style={{marginLeft:'5%'}}>Upload</button>
            </form>
        )
    }
}

export default Uppy;