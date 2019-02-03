import React, { Component } from 'react';
import crypto from 'crypto';
import LoadingPage from './LoadingPage';
import PaymentPortal from './PaymentPortal';

import Database from '../util/database';
import Booking from '../util/booking';
import './css/Payments.css';

const config = require('../util/config.json');

class Payments extends Component {
    constructor() {
        super();
        this.state = {
            paymentAuthorized: false,
            CLIENT: null,
            txnID: null,
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
        authReq.open('POST', '/_payment/authorize/', true)
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
                let authorizedPayment = JSON.parse(atob(JSON.parse(authReq.response).data))
                let responseHmac = crypto.createHmac('sha256', config.clientKey).update(JSON.stringify(authorizedPayment.payment)).digest('hex')            
                if(authorizedPayment.hash === responseHmac) {
                    this.setState({
                        amount: {
                            base: base,
                            total: amt
                        },
                        paymentId: authorizedPayment.payment.id,
                        txnID: authorizedPayment.txnID,
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
        Database.firestore.collection('transactions').doc(this.state.txnID).update({
            status: 'SUCCESS',
            verified: true
        }).then(()=>{
        this.props.success(success)
        }).catch((err)=>{
            console.error(err);
        })
    }

    paymentCancelled = () => {
        console.log('PAYMENT_CANCELLED')
        Database.firestore.collection('transactions').doc(this.state.txnID).update({
            status: 'CANCELLED',
        }).then(()=>{
                this.props.back()
             }).catch((err)=>{
                 this.paymentError()
             })
    }

    paymentError = (code) => {
        console.error('PAYMENT_FAILED', code)
        localStorage.setItem('payment-error-code', code)
        Database.firestore.collection('transactions').doc(this.state.txnID).update({
            status: 'FAILED',
        }).then(()=>{
                this.setState({ paymentAuthorized: false })
            }).catch((err)=>{
                 console.error(err)
            })
    }

    render() {
        const { CLIENT } = this.state

        return (
            <div className="Payments container fit">
            {
                this.state.paymentAuthorized ? (
                    <div>
                        <h2>Payments Page</h2>

                        <div className="action container fit">
                            <button className="button" onClick={ this.props.back.bind(this) }>BACK</button>
                        </div>

                        <div className="pricing">
                            <p>Total</p>
                            <h3>{'\u20B9 ' + Booking.calcTaxInclAmount(this.props.amount)}</h3>
                            <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                        </div>

                        <PaymentPortal
                            env={"sandbox"}
                            clientId={CLIENT}
                            authorizedPayment={ this.state.paymentId }
                            payerId={ this.state.txnID }
                            onSuccess={ this.paymentSuccesful }
                            onCancel={ this.paymentCancelled }
                            onError={ () => this.paymentError('PORTAL_ERROR') }
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