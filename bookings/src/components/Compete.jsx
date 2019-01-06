import React, { Component } from 'react';
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
            paymentReady: true, //false,
            requiredFulfilled: false,
            completion: false,
            data : {
                regTeamName: "NAMAK", //null,
                regTeamEmail: "namak@xtacy.org", //null,
                regTeamInst: null,
                members : []
            },
            required: [
                'regTeamName', 'regTeamEmail', 'members/name', 'members/email'
            ]
        }
    }

    componentDidMount() {
        let _data = this.state.data
        if(this.props.eventData.metadata.teamGit) _data['regTeamGit'] = null
        for (let i=0; i<this.props.eventData.metadata.teamSize; i++)
            _data.members.push({ index: i, name: null, email: null })
        this.setState({
            data: _data
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
                this.setState({ paymentReady: true, completion: true })

                // let hashSequence = this.state.data.regTeamName + config.clientKey + this.state.data.regTeamEmail
                // let hash = crypto.createHash('sha256').update(hashSequence).digest('hex')
                // let key = localStorage.getItem(config.csrfTokenNameKey)
                // let token = localStorage.getItem(config.csrfTokenName+key)
                // Booking.competeRegister(this.state.data, {key: key, token: token}, hash)
                //     .then((res)=>{
                //         if (res.validation)
                //             this.setState({ paymentReady: true, completion: true })
                //     }).catch(()=>{
                //         alert('Error')
                //     })
            }
        } else {
            alert('Please fill in the required fields')
        }
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
                            amount={this.props.eventData.metadata.price}
                            info={this.props.eventData.title}
                            back={ () => this.setState({ paymentReady: false }) }
                        />
                    ) : (
                        this.state.completion ? <SuccessPage/> : console.log()
                    )
                ) : (
                    <div className="Compete container fit">
                        <div className="Team">
                            <div className="fluff">
                                <h2>Competitive</h2>
                                <p>Fill in the form and click register. 
                                    You will recieve a confirmation email 
                                    after a successful registration.</p>
                            </div>

                            <div className="form">
                                <div className="container fit">
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamName" placeholder="Team Name"/>
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamEmail" placeholder="Team Email"/>
                                    {
                                        this.props.eventData.metadata.collectTeamGit ? (
                                            <input type="text" className="textbox" onChange={this.handleChange} id="regTeamGit"
                                                placeholder="Team GitHub (Optional)"/>
                                        ) : console.log()
                                    }

                                    <input type="text" className="textbox" onChange={this.handleChange} id="regTeamInst" 
                                        placeholder="Team Institution (Optional)"/>
                                </div>
                            </div>
                        </div>

                        <h3><span className="highlight">Team Member Details</span></h3>
                        <div className="MemberData">
                        {
                            this.state.data.members.map((mem, i) => { return <Member key={i} index={i} handleChange={this.handleChange}/> })
                        }
                        </div>

                        <button className="button solid" id="reg" onClick={ this.action.bind(this) }>REGISTER</button>
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
                <h3 className="title">Team Member { index + 1 }</h3>
                <input type="text" className="textbox" onChange={this.props.handleChange} id={'mem#' + index +'/name'} placeholder="Name"/>
                <input type="text" className="textbox" onChange={this.props.handleChange} id={'mem#' + index +'/email'} placeholder="Email"/>
            </div>
        );
    }
}

export default Compete;