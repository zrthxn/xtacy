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
            CLIENT: null,
            txnid: null,
            paymentId: null,
            amount: null,
            data : null,
            required: []
        }
    }

    componentDidMount() {
        let base = this.props.amount, amt = Booking.calcTaxInclAmount(this.props.amount)
        let POST_DATA = {
            amount: {
                base: base,
                tax:  (amt - base).toFixed(2),
                total: amt
            },
            payer: {
                name: this.props.name,
                email: this.props.email,
                phone: this.props.phone,
            },
            eventData: {
                eventDescription: this.props.info
            }
        }
        
        let hashSequence = JSON.stringify(POST_DATA)
        let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
        
        const authReq = new XMLHttpRequest()
        authReq.open('POST', 'http://xtacy.org:3000/_payment/authorize/', true)
        authReq.setRequestHeader('Content-Type', 'application/json')
        authReq.send(JSON.stringify({
            data: POST_DATA, 
            csrf: {
                key: localStorage.getItem(config.csrfTokenNameKey),
                token: localStorage.getItem(config.csrfTokenName + 
                    localStorage.getItem(config.csrfTokenNameKey))
            }, 
            checksum: hmac
        }));

        authReq.onreadystatechange = () => {
            if(authReq.readyState===4 && authReq.status===200) {
                let authorizedPayment = JSON.parse(authReq.response)
                let responseHashSequence = JSON.stringify({ id: authorizedPayment.id, txnid: authorizedPayment.txnid })
                let responseHmac = crypto.createHmac('sha256', config.clientKey).update(responseHashSequence).digest('hex')
                
                if(authorizedPayment.hash === responseHmac) {
                    this.setState({
                        amount: {
                            base: base,
                            total: amt
                        },
                        paymentId: authorizedPayment.id,
                        txnid: authorizedPayment.txnid,
                        CLIENT: authorizedPayment.client,
                        paymentAuthorized: true
                    })
                } else
                    this.paymentError('RESPONSE_HASH_MISMATCH')
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

    paymentError = (err) => {
        console.log(err)
    }

    render() {
        const { CLIENT } = this.state

        return (
            <div className="Payments container fit">
                <h2>Payments Page</h2>

                <div className="display">
                    <div className="amount">
                        <h3>{ this.state.amount }</h3>
                        <p>AMOUNT</p>
                    </div>
                </div>

                <div className="action container fit">
                    <button className="button" onClick={ this.props.back.bind(this) }>BACK</button>
                    {
                        this.state.paymentAuthorized ? (
                            <PaymentPortal
                                env={"sandbox"}
                                clientId={CLIENT}
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