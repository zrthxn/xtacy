import React, { Component } from 'react';
import crypto from 'crypto';
import Booking from '../util/booking';
import './css/Register.css';
import '../Global.css';

import SuccessPage from './SuccessPage';

const config = require('../util/config.json');

class Register extends Component {
    constructor() {
        super();
        this.state = {
            requiredFulfilled: false,
            completion: false,
            data: {
                regName: null,
                regEmail: null,
                regPhone: null,
                regInst: null
            },
            required: [
                'regName', 'regEmail', 'regPhone'
            ]
        }
    }

    handleChange = (event) => {
        let payload = null, truth = true, _data = this.state.data
        if ( event.target.value!=="" ) payload = event.target.value
        _data[event.target.id] = payload
        for ( let field of this.state.required )
            if ( this.state.data[field]===null || (event.target.id===field && payload===null) )
                truth = false 
        this.setState({
            requiredFulfilled: truth,
            data: _data
        })
    }

    action = () => {
        if(this.state.requiredFulfilled) {
            let hashSequence = JSON.stringify(this.state.data)
            let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
            Booking.generalRegister(this.state.data, hmac)
                .then((res)=>{
                    if (res.validation)
                        this.setState({ completion: true, rgn: res.rgn })
                }).catch(()=>{
                    alert('Error')
                })
        } else {
            alert('Please fill in the required fields')
        }
    }

    render() {
        return (
            <div>
            {
                this.state.completion ? (
                    <SuccessPage rgn={this.state.rgn} payment={false}/>
                ) : (
                    <div className="Register container fit">
                        <div className="fluff">
                            <h2>Registration</h2>
                            <p>Fill in the form and click register. 
                                You will recieve a confirmation email 
                                after a successful registration.</p>                        
                        </div>

                        <div className="form">
                            <div className="container fit">
                                <input type="text" className="textbox" onChange={this.handleChange} id="regName" placeholder="Name"/>
                                <input type="text" className="textbox" onChange={this.handleChange} id="regEmail" placeholder="Email"/>
                                <input type="text" className="textbox" onChange={this.handleChange} id="regPhone" placeholder="Phone"/>
                                <input type="text" className="textbox" onChange={this.handleChange} id="regInst" placeholder="Institution (Optional)"/>

                                <button className="button solid" id="reg" onClick={ this.action.bind(this) }>REGISTER</button>
                            </div>
                        </div>
                    </div>
                )
            }
            </div>
        );
    }
}

export default Register;