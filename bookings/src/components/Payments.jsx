import React, { Component } from 'react';
import crypto from 'crypto';
import SuccessPage from './SuccessPage';

import './css/Payments.css';

// AFTER SUCCESS
// let hashSequence = this.state.data.regTeamName + config.clientKey + this.state.data.regTeamEmail
// let hash = crypto.createHmac('sha256', hashSequence).digest('hex')
// let key = localStorage.getItem(config.csrfTokenNameKey)
// let token = localStorage.getItem(config.csrfTokenName+key)
// Booking.competeRegister(this.state.data, {key: key, token: token}, hash)
//     .then((res)=>{
//         if (res.validation)
//             this.setState({ completion: true })
//     }).catch(()=>{
//         alert('Error')
//     })

const config = require('../util/config.json');

class Payments extends Component {
    constructor() {
        super();
        this.state = {
            requiredFulfilled: false,
            txnid: 0x00,
            hash: 0x00,
            amount: 0x00,
            data : {
                phone: null
            },
            required: [
                'phone'
            ]
        }
    }

    async componentDidMount() {
        let txnid = await this.generateTxnID()
        let amount =  this.props.calcTax ? this.calcTax(this.props.amount * 1.04) : this.props.amount
        let hashSequence = `${config.payments.key}|${txnid}|${amount}|${this.props.info}|` +
        `${this.props.name}|${this.props.email}|${''}|${''}|${''}|${''}|${''}|${''}|||||${config.payments.salt}`
        let hash = crypto.createHash('sha512').update(hashSequence).digest('hex')
        this.setState({
            amount: amount,
            txnid: txnid,
            hash: hash
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

    generateTxnID = async () => {
        let txn = "992901388911238GVDWO"
        return txn
    }

    render() {
        return (
            <div className="Payments container fit">
                <h2>Payments Page</h2>

                {/* <input type="text" className="textbox" onChange={this.handleChange} id="phone" placeholder="Phone"/> */}

                <div className="display">
                    <div className="amount">
                        <h3>{this.state.amount}</h3>
                        <p>AMOUNT</p>
                    </div>
                </div>

                {/* https://secure.payu.in/_payment on production or https://sandboxsecure.payu.in/_payment in test */}
                <form action="https://sandboxsecure.payu.in/_payment" method="POST" name="payuform" className="form">
                    <input hidden readOnly type="text" name="key" value={config.payments.key}/>

                    <input hidden readOnly type="text" name="firstname" value={this.props.name}/>
                    <input hidden readOnly type="text" name="email" value={this.props.email}/>
                    <input hidden readOnly type="text" name="productinfo" value={this.props.info}/>
                    <input hidden readOnly type="text" name="txnid" value={this.state.txnid}/>
                    <input hidden readOnly type="text" name="amount" value={this.state.amount}/>

                    {/* <input hidden readOnly type="text" name="phone" value={this.state.data.phone}/> */}
                    <input required type="text" name="phone" className="textbox" onChange={this.handleChange} 
                        id="phone" placeholder="Phone"/>

                    <p>Information about the booking as seen from space</p>

                    <input hidden readOnly type="text" name="hash" value={this.state.hash}/>

                    {/* <input hidden readOnly type="text" name="udf1" value=""/>
                    <input hidden readOnly type="text" name="udf2" value=""/>
                    <input hidden readOnly type="text" name="udf3" value=""/>
                    <input hidden readOnly type="text" name="udf4" value=""/>
                    <input hidden readOnly type="text" name="udf5" value=""/> */}

                    <input hidden readOnly type="text" name="surl" value="http://xtacy.org/s/"/>
                    <input hidden readOnly type="text" name="furl" value="http://xtacy.org/f/"/>
                    <input hidden readOnly type="text" name="service_provider" value="payu_paisa"/>

                    <div className="action">
                        <button className="button solid" onClick={ this.props.back.bind(this) }>BACK</button>
                        <button className="button solid red" name="submit">PROCEED</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Payments;