import React, { Component } from 'react';
import crypto from 'crypto';
import LoadingPage from './LoadingPage';
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
                token: localStorage.getItem(config.csrfTokenName + localStorage.getItem(config.csrfTokenNameKey))
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
                        data: this.props.data,
                        paymentAuthorized: true
                    })
                } else
                    this.paymentError('RESPONSE_HASH_MISMATCH')
            } else if(authReq.readyState===4 && authReq.status===403) {
                this.paymentError('CSRF_TIMEOUT')
            } else if(authReq.readyState===4 && authReq.status===500) {
                this.paymentError('SERVER_ERROR')
            }
        }        
    }

    paymentSuccesful = (success) => {
        console.log('PAYMENT_SUCCESSFUL')
        // UPDATE firestore ka txn with status: 'SUCCESS'
        // cleanup
        this.props.success()
    }

    paymentCancelled = (failure) => {
        console.log('PAYMENT_FAILED')
        console.error(failure)
        // UPDATE firestore ka txn with status: 'CANCELLED'
        // cleanup
        localStorage.setItem('payment-fail-data', this.state.data)
        window.location = '/book/failure'
    }

    paymentError = (code, err) => {
        console.log('PAYMENT_FAILED', code)
        console.error(err)
        // UPDATE firestore ka txn with status: 'ERROR'
        // Cleanup
        localStorage.setItem('payment-error-data', this.state.data)
        window.location = '/book/error'
    }

    render() {
        const { CLIENT } = this.state

        return (
            <div className="Payments container fit">
            {
                this.state.paymentAuthorized ? (
                    <div>
                        <h2>Payments Page</h2>

                        <div className="pricing">
                            <h3>{'Total: \u20B9 ' + Booking.calcTaxInclAmount(this.state.data.amount)}</h3>
                            <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                            <button className="button solid" id="reg" onClick={ this.action.bind(this) }>PROCEED</button>
                        </div>

                        <div className="action container fit">
                            <button className="button" onClick={ this.props.back.bind(this) }>BACK</button>
                        </div>

                        <PaymentPortal
                            env={"sandbox"}
                            clientId={CLIENT}
                            authorizedPayment={ this.state.paymentId }
                            onSuccess={ this.paymentSuccesful }
                            onCancel={ this.paymentCancelled }
                            onError={ (err) => this.paymentError('PORTAL_ERROR', err) }
                        />
                    </div>
                ) : (
                    <LoadingPage timeOut={5000}/>
                )
            }
            </div>
        );
    }
}

export default Payments;