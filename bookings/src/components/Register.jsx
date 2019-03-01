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
            errors: {
                email: false,
                phone: false,
                name: false
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
            if(!(this.state.errors.name || this.state.errors.phone || this.state.errors.email)){
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
                alert('Please ensure that the data entered is correct')
            }
        } else {
            alert('Please fill in the required fields')
        }
    }

    validate(event)
    {   
        if(event.target.id==='regEmail') {
            if(event.target.value.match(/^\S+@\S+[\.][0-9a-z]+$/)==null){
                this.setState({
                    errors : {
                        name: this.state.errors.name,
                        phone: this.state.errors.phone,
                        email: true
                    }
                })
            }
            else this.setState({
                errors : {
                    name: this.state.errors.name,
                    phone: this.state.errors.phone,
                    email: false
                }
            })
        }
        else if (event.target.id==='regPhone'){
            if(event.target.value.match(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/)==null){  
                this.setState({
                    errors: {
                        name: this.state.errors.name,
                        phone: true,
                        email: this.state.errors.email
                    }
                })
            }
            else this.setState({
                errors : {
                    name: this.state.errors.name,
                    phone: false,
                    email: this.state.errors.email
                }
            })
        }
        else if(event.target.id==='regName'){
            if(event.target.value.match(/^([^0-9]*)$/)==null){  //doesnt have a digit
                this.setState({
                    errors: {
                        name: true,
                        phone: this.state.errors.phone,
                        email: this.state.errors.email
                    }
                })
            }
            else this.setState({
                errors: {
                    name: false,
                    phone: this.state.errors.phone,
                    email: this.state.errors.email
                }
            })
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
                                <input type="text" className={this.state.errors.name?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regName" placeholder="Name"/>
                                <input type="text" className={this.state.errors.email?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regEmail" placeholder="Email"/>
                                <input type="text" className={this.state.errors.phone?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regPhone" placeholder="Phone"/>
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