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
        _data.amount = Booking.calcTaxInclAmount(this.props.eventData.metadata.price)
        
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
            if(this.props.eventData.metadata.paid) {
                this.setState({ paymentReady: true })
            } else {
                this.success()
            }
        } else {
            alert('Please fill in the required fields')
        }
    }

    success = () => {
        let hashSequence = JSON.stringify(this.state.data)
        let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
        Booking.competeRegister(this.state.data, hmac)
            .then((res)=>{
                if (res.validation)
                    this.setState({ paymentReady: true, completion: true })
            }).catch(()=>{
                alert('Error')
            })
    }

    render() {
        return (
            <div>
            {
                this.state.paymentReady ? (
                    this.props.eventData.metadata.paid ? (
                        <Payments
                            name={this.state.data.regTeamName}
                            email={this.state.data.regTeamEmail}
                            phone={this.state.data.regTeamPhone}
                            amount={this.state.data.amount}
                            calcTaxInclAmount={true}
                            info={this.props.eventData.title}
                            back={ () => this.setState({ paymentReady: false }) }
                            success={ this.success }
                        />
                    ) : (
                        this.state.completion ? <SuccessPage/> : console.log()
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
                                <div className="container fit">
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamName" placeholder="Team Name"/>
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamEmail" placeholder="Team Email"/>
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamPhone" placeholder="Phone Number"/>
                                    {
                                        this.props.eventData.metadata.collectTeamGit ? (
                                            <input type="text" className="textbox" onChange={this.handleChange} id="regTeamGit"
                                                placeholder="Team GitHub (Optional)"/>
                                        ) : console.log()
                                    }
                                    {
                                        this.props.eventData.metadata.teamSizeType==='loose' ? (
                                            <input type="text" className="textbox" onChange={this.handleChange} id="regTeamLeader" placeholder="Team Leader Name"/>
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
                                <button className="button solid" id="reg" onClick={ this.action.bind(this) }>PROCEED</button>
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