import React, { Component } from 'react';
import Payments from './Payments';
import SuccessPage from './SuccessPage';

import './css/Tickets.css';
import '../Global.css'; 

class Tickets extends Component {
    constructor() {
        super();
        this.state = {
            requiredFulfilled: false,
            completion: false,
            tierPricing: null,
            data : {
                regName: null,
                regEmail: null,
                regPhone: null,
                regInst: null,
                tier: null,
                number: 0,
                amount: 0
            },
            required: [
                'regName', 'regEmail', 'regPhone'
            ]
        }
    }

    componentDidMount() {
        let trP, _data = this.state.data;
        if( typeof this.props.eventData.metadata.price === 'number' )
            trP = this.props.eventData.metadata.price
        else if( typeof this.props.eventData.metadata.price === 'object' )
            trP = this.props.eventData.metadata.price[1]

        _data.number = 1
        _data.tier = 'Standard'
        _data.amount = trP * _data.number * 1.04
        this.setState({
            tierPricing: trP,
            data: _data
        })
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
        let _data = this.state.data, _trP = this.props.eventData.metadata.price[ event.target.value ]
        _data.amount = _trP * _data.number * 1.04
        switch (event.target.value) {
            case '0':
                _data.tier = 'Budget';
                break;
            case '1':
                _data.tier = 'Standard';
                break;
            case '2':
                _data.tier = 'Premium';
                break;
            default:
                break;
        }
        
        this.setState({
            tierPricing: _trP,
            data: _data
        })
    }

    handleSizeChange = (action) =>{
        let _data = this.state.data
        if(action==='incr' && _data.number!==4) 
            _data.number++
        else if(action==='decr' && _data.number!==1)
            _data.number--
        let amt = this.state.tierPricing * _data.number * 1.04
        _data.amount = amt
        this.setState({
            data: _data,
        })
    }

    action = () => {
        if(this.state.requiredFulfilled) {
            this.setState({ paymentReady: true })
        } else {
            alert('Please fill in the required fields')
        }
    }

    success = () => {
        
    }

    render() {
        return (
            <div>
            {
                this.state.paymentReady ? (
                    this.state.completion ? <SuccessPage/> : (
                        <Payments
                            name={this.state.data.regName}
                            email={this.state.data.regEmail}
                            phone={this.state.data.regPhone}
                            amount={this.state.data.amount}
                            calcTax={false}
                            info={this.props.eventData.title}
                            back={ () => this.setState({ paymentReady: false }) }
                            success={ this.success }
                        />
                    )
                ) : (
                    <div className="Tickets container fit">
                        <div className="Details">
                            <div className="fluff">
                                <p><i>Events</i></p>
                                <h2>{this.props.eventData.title}</h2>
                                <p>Fill in the form and click proceed. 
                                    You will recieve a confirmation email 
                                    after a successful booking.</p>
                            </div>

                            <div className="form">
                                <div className="container fit">
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regName" placeholder="Name"/>
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regEmail" placeholder="Email"/>
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regPhone" placeholder="Phone"/>
                                    <input type="text" className="textbox" onChange={this.handleChange} id="regInst" placeholder="Institution (Optional)"/>
                                </div>
                            </div>
                        </div>
                        <h3><span className="highlight">Book Tickets</span></h3>
                        <div className="Seats">
                            <div className="display container">
                                <img src="/static/img/thumb.jpg" alt="seating"/>
                            </div>
                            <div className="controls container">
                                {
                                    typeof this.props.eventData.metadata.price === 'object' ? (
                                        <div className="tiers">
                                            <p>Select a Teir</p>
                                            <select className="dropdown" defaultValue={1} onChange={this.handleTierChange} passive="true">
                                                <option value={0}>Budget</option>
                                                <option value={1}>Standard</option>
                                                <option value={2}>Premium</option>
                                            </select>
                                        </div>                          
                                    ) : console.log()
                                }
                                <div className="selector">
                                    <p>Select a Number</p>

                                    <div className="number">
                                        <h3 className="actual-number">{this.state.data.number + ' ' + (this.state.data.number>1 ? 'Tickets' : 'Ticket')}</h3>
                                        
                                        <div className="buttons">
                                            <label id="decr" onClick={() => { this.handleSizeChange('decr') }}>-</label>
                                            <label id="incr" onClick={() => { this.handleSizeChange('incr') }}>+</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="pricing">
                                    <p id="trP">{'Rs ' + this.state.tierPricing + ' per ticket'}</p>
                                    <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                                    <h3>{'Total: Rs ' + this.state.data.amount}</h3>
                                </div>
                                <input type="text" className="textbox" onChange={this.handleChange} id="specialRequests" placeholder="Special Requests (if any)"/>
                            </div>
                        </div>
                        <button className="button solid" id="reg" onClick={ this.action.bind(this) }>PROCEED</button>                     
                    </div>
                )
            }
            </div>
        );
    }
}

export default Tickets;