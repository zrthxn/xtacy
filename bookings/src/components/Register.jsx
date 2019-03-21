import React, { Component } from 'react';
import crypto from 'crypto';
import Booking from '../util/booking';
import './css/Register.css';
import '../Global.css';
import Payments from './Payments';

import SuccessPage from './SuccessPage';
import { throws } from 'assert';

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
                regInst: null,
                tier:'standard',
                amount:0
            },
            premium:false,
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

    handleTierChange = (event) => {
        let _data = this.state.data
        if(event.target.value==='gold'){
            _data.amount=500
            _data.tier='gold'
            this.setState({
                premium:true,
                data:_data
            })
        }
        else if(event.target.value==='silver'){
            _data.amount = 300
            _data.tier='silver'
            this.setState({
                premium:true,
                data:_data
            })
        }
        else {
            _data.amount=0
            _data.tier='standard'
            this.setState({
                premium:true,
                data:_data
            })
        }
    }
    
    action = () => {
        if(this.state.requiredFulfilled) {
            if(!(this.state.errors.name || this.state.errors.phone || this.state.errors.email)){
                if(!this.state.premium){
                    let hashSequence = JSON.stringify(this.state.data)
                    let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
                    Booking.generalRegister(this.state.data, hmac)
                        .then((res)=>{
                            if (res.validation)
                                this.setState({ completion: true, rgn: res.rgn })
                        }).catch(()=>{
                            alert('Error')
                        })
                }
                else {
                    this.setState({completion:true})
                }
            } else {
                alert('Please ensure that the data entered is correct')
            }
        } else {
            alert('Please fill in the required fields')
        }
    }

    validate = (event) => {   
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
                this.state.completion ? ( this.state.premium ? ( 
                    <Payments 
                        name = {this.state.data.regName}
                        email = {this.state.data.regEmail}
                        phone = {this.state.data.phone}
                        amount = {this.state.data.amount}
                        eventData = {{
                            'title': 'Xtacy Registration',
                            'type': 'gen',
                            'tier': this.state.data.tier
                        }}
                        regData = {this.state.data}
                        back = { () => {this.setState({completion:false})}} />
                    ) :  <SuccessPage rgn={this.state.rgn} payment={false}/>
                ) : (
                    <div className="Register container fit">
                        <div className="fluff">
                            <h2>Registration</h2>
                            <p>Fill in the form and click register. 
                                You will recieve a confirmation email 
                                after a successful registration.</p>
                            <p>
                                You can decide between Standard, Silver and Gold passes for Xtacy'19.<br/>
                                Standard pass only gives you entry to the fest, while Silver and Gold Passes come with their own perks.<br/>
                                Silver pass perks <br/>
                                Gold pass perks <br/>
                                </p>                        
                        </div>

                        <div className="form">
                            <div className="container fit">
                                <input type="text" className={this.state.errors.name?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regName" placeholder="Name"/>
                                <input type="text" className={this.state.errors.email?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regEmail" placeholder="Email"/>
                                <input type="text" className={this.state.errors.phone?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regPhone" placeholder="Phone"/>
                                <input type="text" className="textbox" onChange={this.handleChange} id="regInst" placeholder="Institution (Optional)"/>
                                
                                    {
                                        this.props.intent==='gen' ? (
                                            <select className="dropdown" id="tier" onChange={this.handleTierChange}>
                                            <option value="standard">Standard</option>
                                            <option value="silver">Silver</option>
                                            <option value="gold">Gold</option>
                                            </select>
                                        ):(
                                            <select className="dropdown" id="tier" onChange={this.handleTierChange}>
                                            <option value="silver">Silver</option>
                                            <option value="gold">Gold</option>
                                            </select>
                                        )
                                    }
                                    
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