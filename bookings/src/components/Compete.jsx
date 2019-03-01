import React, { Component } from 'react';
import crypto from 'crypto';
import SuccessPage from './SuccessPage';
import Payments from './Payments';

import Booking from '../util/booking';
import './css/Compete.css';
import '../Global.css'; 

const config = require('../util/config.json');

class Compete extends Component {
    constructor() {
        super();
        this.state = {
            paymentReady: false,
            requiredFulfilled: false,
            completion: false,
            data : {
                eventId: null,
                regTeamName: null,
                regTeamEmail: null,
                regTeamPhone: null,
                regTeamInst: null,
                amount: null,
                members : []
            },
            errors :{
                email: false,
                phone: false,
                number: false
            },
            required: [
                'regTeamName', 'regTeamEmail', 'regTeamPhone'
            ]
        }
    }

    componentDidMount() {
        let _data = this.state.data, req
        _data.eventId = this.props.eventData.eventId
        if(this.props.eventData.metadata.collectTeamGit) _data['regTeamGit'] = null
        if(this.props.eventData.metadata.teamSizeType==='strict') {
            for (let i=0; i<this.props.eventData.metadata.teamSize; i++)
                _data.members.push({ index: i, name: null, email: null })
            req = [ 'regTeamName', 'regTeamEmail', 'regTeamPhone', 'members/name', 'members/email' ]
        } else if(this.props.eventData.metadata.teamSizeType==='loose') {
            req = [ 'regTeamName', 'regTeamEmail', 'regTeamPhone', 'regTeamLeader', 'regTeamSize' ]
        }
        _data.amount = (this.props.eventData.metadata.price)
        
        this.setState({
            data: _data,
            required: req
        })
    }

    handleChange = (event) => {
        let payload = null, truth = true, _data = this.state.data
        if ( event.target.value!=="" ) payload = event.target.value
        if (event.target.id.includes('/')){
            let identifier = event.target.id.split('/')[1], index = event.target.id.split('/')[0].split('#')[1]
            _data.members[index][identifier] = payload
        } else
            _data[event.target.id] = payload 

        for ( let field of this.state.required ) {
            if(field.includes('/')) {
                field = field.split('/')
                for ( let member of this.state.data.members )
                    if ( member[field[1]]===null || (event.target.id.split('/')[1]===field[1] && payload===null) )
                        truth = false
            } else {
                if ( this.state.data[field]===null || (event.target.id===field && payload===null) )
                        truth = false
            }
        }
        this.setState({
            requiredFulfilled: truth,
            data: _data
        })
    }

    action = () => {
        if(this.state.requiredFulfilled) {
            if(!(this.state.errors.name || this.state.errors.phone || this.state.errors.email)){
                if(this.props.eventData.metadata.paid) {
                    localStorage.setItem('x-return-key', 'PAY_INITIALIZE')
                    localStorage.setItem('x-return-pay-token', 'PAY_INITIALIZE')
                    this.setState({ paymentReady: true })
                } else {
                    this.success(null)
                }
            } else {
                alert('Please ensure the data entered is correct')
            }
        } else {
            alert('Please fill in the required fields')
        }
    }

    success = (txn) => {
        if(!this.props.eventData.metadata.paid) txn = 'NON_PAID'
        let hashSequence = JSON.stringify(this.state.data)
        let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
        Booking.competeRegister(this.state.data, hmac, txn)
            .then((res)=>{
                if (res.validation)
                    this.setState({ paymentReady: true, completion: true, rgn: res.rgn })
            }).catch(()=>{
                alert('Error')
            })
    }
    validate(event)
    {
        if(event.target.id==='regTeamEmail') {
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
        else if (event.target.id==='regTeamPhone'){
            if(event.target.value.match(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/)==null){  
                this.setState({
                    errors : {
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
        else if(event.target.id==='regTeamName'){
            if(event.target.value.match(/^([^0-9]*)$/)==null){  //doesnt have a digit
                this.setState({
                    errors : {
                        name: true,
                        phone: this.state.errors.phone,
                        email: this.state.errors.email
                    }
                })
            }
            else this.setState({
                errors : {
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
                this.state.paymentReady ? (
                    this.props.eventData.metadata.paid ? (
                        <Payments
                            name={this.state.data.regTeamLeader}
                            email={this.state.data.regTeamEmail}
                            phone={this.state.data.regTeamPhone}
                            amount={this.state.data.amount}
                            eventData={this.props.eventData}
                            regData={this.state.data}
                            back={ () => this.setState({ paymentReady: false }) }
                        />
                    ) : (
                        this.state.completion ? <SuccessPage rgn={this.state.rgn} payment={this.props.eventData.metadata.paid}/> : console.log()
                    )
                ) : (
                    <div className="Compete container fit">
                        <div className="Team">
                            <div className="fluff">
                                <p><i>Competitions</i></p>
                                <h2>{this.props.eventData.title}</h2>
                                <p>Fill in the form and click register. 
                                    You will recieve a confirmation email
                                    after a successful registration.</p>
                            </div>

                            <div className="form">
                                <div className="container">
                                    <input type="text" className={this.state.errors.name?"textbox error":"textbox"} onChange={this.handleChange} id="regTeamName" placeholder="Team Name"/>
                                    <input type="text" className={this.state.errors.email?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regTeamEmail" placeholder="Team Email"/>
                                    <input type="text" className={this.state.errors.phone?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regTeamPhone" placeholder="Phone Number"/>
                                    {
                                        this.props.eventData.metadata.collectTeamGit ? (
                                            <input type="text" className="textbox" onChange={this.handleChange} id="regTeamGit"
                                                placeholder="Team GitHub (Optional)"/>
                                        ) : console.log()
                                    }
                                    {
                                        this.props.eventData.metadata.teamSizeType==='loose' ? (
                                            <input type="text" className={this.state.errors.name?"textbox error":"textbox"} onChange={this.handleChange} onBlur={this.validate.bind(this)} id="regTeamLeader" placeholder="Team Leader Name"/>
                                        ) : console.log()
                                    }
                                    {
                                        this.props.eventData.metadata.teamSizeType==='loose' ? (
                                            <input type="number" className="textbox" onChange={this.handleChange} id="regTeamSize" placeholder="Team Size"
                                                max={this.props.eventData.metadata.teamSize} min={0}/>
                                        ) : console.log()
                                    }

                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamInst" 
                                        placeholder="Team Institution (Optional)"/>
                                </div>
                            </div>
                        </div>

                        {
                            this.props.eventData.metadata.teamSizeType==='strict' ? (
                                <div>
                                    <h3><span className="highlight">Team Member Details</span></h3>
                                    <div className="MemberData">
                                    {
                                        this.state.data.members.map((mem, i) => { return <Member key={i} index={i} handleChange={this.handleChange}/> })
                                    }
                                    </div>
                                </div>
                            ) : console.log()
                        }

                        {
                            this.props.eventData.metadata.paid ? (
                                <div className="pricing">
                                    <p id="trP">{'\u20B9 ' + this.state.data.amount + ' per team'}</p>
                                    <h3>{'Total \u20B9 ' + Booking.calcTaxInclAmount(this.state.data.amount)}</h3>
                                    <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                                    <button className="button solid" id="reg" onClick={ this.action.bind(this) }>PROCEED</button>
                                </div>
                            ) : (
                                <button className="button solid" id="reg" onClick={ this.action.bind(this) }>REGISTER</button>
                            )
                        }                        
                    </div>
                )
            }
            </div>
        );
    }
}

class Member extends Component {
    
    render() {
        let index = this.props.index
        return (
            <div className="Member container fit">
                <h3 className="title">
                    Team Member { index + 1 }
                    {
                        index === 0 ? (
                            <span className="team-leader-text"><span></span>TEAM LEADER<span></span></span>
                        ) : console.log()
                    }
                </h3>
                <input type="text" className="textbox" onChange={this.props.handleChange} id={'mem#' + index +'/name'} placeholder="Name"/>
                <input type="text" className="textbox" onChange={this.props.handleChange} id={'mem#' + index +'/email'} placeholder="Email"/>
            </div>
        );
    }
}

export default Compete;