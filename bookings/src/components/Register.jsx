import React, { Component } from 'react';
import crypto from 'crypto';
import Booking from '../util/booking';
import './css/Register.css';
import '../Global.css';
import Payments from './Payments';

import { storage } from '../util/database';
import SuccessPage from './SuccessPage';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import AcknowledegmentPage from './AcknowledgmentPage';
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
            txn: '',
            uploading : false,
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
    componentDidMount() {
        var ack = ''
        for(let i=0; i<6; i++){
            ack += Math.floor(Math.random()*10)
        }
        let _data = this.state.data
        if(this.props.intent==='gen'){
            _data.tier = 'standard'
            _data.amount=0
            this.setState({
                premium: false,
                data:_data,
                txn : ack
            })
        }
        else if(this.props.intent==='prm'){
            _data.tier = 'gold'
            _data.amount = 250
            this.setState({
                premium: true,
                data: _data,
                txn: ack
            })
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
            _data.amount=250
            _data.tier='gold'
            this.setState({
                premium:true,
                data:_data
            })
        }
        else {
            _data.amount=0
            _data.tier='standard'
            this.setState({
                premium:false,
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
                    
                    let _data = this.state.data   
                    _data['txn'] = this.state.txn
                    localStorage.setItem('x-return-key', 'PAY_INITIALIZE')
                    localStorage.setItem('x-return-pay-token', 'PAY_INITIALIZE')
                    let hashSequence = JSON.stringify(_data)
                        let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
                        Booking.bookingAcknowledegment(_data, hmac).then((ack) => {
                            this.setState({
                                completion: true, rgn : ack
                            })
                        })
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
                    <AcknowledegmentPage rgn = {this.state.rgn} payment = {false} />
                /*    <Payments 
                        name = {this.state.data.regName}
                        email = {this.state.data.regEmail}
                        phone = {this.state.data.regPhone}
                        amount = {this.state.data.amount}
                        eventData = {{
                            'title': 'Xtacy Registration',
                            'type': 'gen',
                            'tier': this.state.data.tier
                        }}
                        regData = {this.state.data}
                    back = { () => {this.setState({completion:false})}} />  */
                    ) :  <SuccessPage rgn={this.state.rgn} payment={false}/>
                ) : (
                    <div className="Register container fit">
                        <div className="fluff">
                            <h2>Registration</h2>
                            <p>Fill in the form and click register. 
                                You will recieve a confirmation email 
                                after a successful registration.</p>
                            <p>
                                <b>Gold Pass needed for Kunal Kamra's Show</b> <br/>
                            </p>  

                            {
                                this.state.premium ? (
                                    <div>
                                        {/* <br/>
                                        <br/>
                                        <p><b>Step 1</b>: Pay {'\u20B9 '+Booking.calcTaxInclAmount(this.state.data.amount)} using Google Pay or PhonePe to <b>8173824682</b> (Syed Mohammad Mehdi Rizvi)</p>
                                        <br/><p><b>Step 2</b>: Fill this form and upload a screenshot of the confirmation page.</p><br/>
                                        <p><b>Step 3</b>: We will verify your payment and send you a confirmation email within 2 hours.</p><br/>
                                        <b>YOU NEED TO MAKE SEPERATE REGISTRATIONS FOR EACH INDIVIDUAL i.e. ONE PAYMENT FOR ONE REGISTRATION</b><br/> */}
                                    </div>
                                ) : (
                                    console.log()
                                )
                            }                       
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
                                                <option value="gold">Gold</option>
                                            </select>
                                        ):(
                                            <select className="dropdown" id="tier" onChange={this.handleTierChange}>
                                                <option value="gold">Gold</option>
                                                <option value="standard">Standard</option>
                                            </select>
                                        )
                                    }
                                    {
                                        this.state.premium?(
                                            <div className="pricing"> 
                                                {/* <p id="trP">{'\u20B9 ' + this.state.data.amount +' per person'}</p>
                                                <h3>{'Total \u20B9 ' + Booking.calcTaxInclAmount(this.state.data.amount)}</h3>
                                                <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                                                
                                                <p>Sample Screenshot</p>
                                                <img id="SamplePay" src="/static/img/Sample.jpeg" width="200px" alt="Sample"/> */}
                                                <b>REGISTRATIONS HAVE BEEN CLOSED</b><br/>
                                                <b>Thanks for the overwhelming response</b>
                                               {/* <button className="button solid" id="reg" onClick={ this.action.bind(this) }>PROCEED</button> */}
                                                
                                                {/* <CustomUploadButton
                                                    className="button solid"
                                                    accept="image/*"
                                                    filename = { file => this.state.txn + file.name.split('.')[1]}
                                                    storageRef={storage.ref('payScreenshots')}
                                                    onUploadError={this.handleUploadError}
                                                    onProgress={()=> this.setState({uploading: true})}
                                                    onUploadSuccess={this.action.bind(this)}
                                                    style={{color: 'white', padding: 10}} >
                                                    Upload and Proceed
                                                </CustomUploadButton>
                                                {
                                                    this.state.uploading ? (
                                                        <h3> Uploading... </h3>
                                                    ) : (
                                                        console.log()
                                                    )
                                                } */}

                                            </div>
                                        ):(
                                            <div className="pricing">
                                                <br /><br /><br />
                                                <button className="button solid" id="reg" onClick={ this.action.bind(this) }>REGISTER</button>
                                            </div>
                                        )
                                    }                                      
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