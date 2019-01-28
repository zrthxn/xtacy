import React, { Component } from 'react';
import crypto from 'crypto';
import TemporaryLoadingScreen from './TemporaryLoadingScreen';
import PaymentPortal from './PaymentPortal';

import Booking from '../util/booking';
import './css/Payments.css';

const config = require('../util/config.json');

class Payments extends Component {
    constructor() {
        super();
        this.state = {
            paymentAuthorized: false,
            CLIENT_ID: null,
            txnid: null,
            paymentId: null,
            amount: null,
            data : null,
            required: []
        }
    }

    componentDidMount() {
        let amt = this.props.amount
        if(this.props.calcTaxInclAmount)
            amt = Booking.calcTaxInclAmount(this.props.amount)

        // let authorizedPayment
        const authReq = new XMLHttpRequest();
        authReq.open('POST', 'http://xtacy.org/_payment/authorize/', true)
        authReq.setRequestHeader('Content-Type', 'application/json')
        // authReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash }));

        authReq.onreadystatechange = () => {
            if(authReq.readyState===4 && authReq.status===200) {
                let authorizedPayment = JSON.parse(authReq.response);
                // let responseHashSequence = JSON.stringify({ validation: authorizedPayment.validation, rgn: authorizedPayment.rgn })
                // let responseHmac = crypto.createHmac('sha256', config.clientKey).update(responseHashSequence).digest('hex')
                this.setState({
                    amount: amt,
                    clientId: authorizedPayment.CLIENT_ID,
                    txnid: authorizedPayment.txnid,
                    paymentId: authorizedPayment.id,
                    paymentAuthorized: true
                })
            }
        }
    }

    paymentSuccesful = (success) => {
        console.log('PAYMENT SUCCESSFUL')
        alert('PAYMENT SUCCESSFUL')
    }

    paymentFailed = (failure) => {
        console.log('PAYMENT FAILED')
        alert('PAYMENT FAILED')
    }

    render() {
        const { CLIENT_ID } = this.state

        return (
            <div className="Payments container fit">
                <h2>Payments Page</h2>

                <div className="display">
                    <div className="amount">
                        <h3>{ this.state.amount }</h3>
                        <p>AMOUNT</p>
                    </div>
                </div>

                <div className="action">
                    <button className="button" onClick={ this.props.back.bind(this) }>BACK</button>
                    {
                        this.state.paymentAuthorized ? (
                            <PaymentPortal
                                env={"sandbox"}
                                clientId={CLIENT_ID}
                                authorizedPayment={ this.state.paymentId }
                                onSuccess={ this.paymentSuccesful }
                                onCancel={ this.paymentFailed }
                                onError={ this.paymentFailed }
                            />
                        ) : (
                            <TemporaryLoadingScreen/>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Payments;