import React, { Component } from 'react';
import crypto from 'crypto';
import LoadingPage from './LoadingPage';

import Database from '../util/database';
import Booking from '../util/booking';
import './css/Payments.css';
import SuccessPage from './SuccessPage';
import ErrorPage from './ErrorPage';

const config = require('../util/config.json');

class Payments extends Component {
    constructor() {
        super();
        this.state = {
            paymentCreated: false,
            completion: false,
            paymentSuccesful: false,
            txnId: null,
            paymentId: null,
            amount: null,
            data : null,
            required: []
        }
    }

    componentDidMount() {
        let returnKey = localStorage.getItem('x-return-key')
        let returnPayToken = localStorage.getItem('x-return-pay-token')
        let returnTxnId = localStorage.getItem('x-txn-id')

        if(returnKey==='PAY_INITIALIZE') {
            // Payment Initiate Process
            let base = this.props.amount, amt = Booking.calcTaxInclAmount(this.props.amount)
            let POST_DATA = {
                eventData: this.props.eventData,
                amount: {
                    base: base,
                    tax:  (amt - base).toFixed(2),
                    total: amt
                },
                payer: {
                    name: this.props.name,
                    email: this.props.email,
                    phone: this.props.phone,
                }
            }
            
            let hashSequence = JSON.stringify(POST_DATA)
            let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
            
            const createReq = new XMLHttpRequest()
            createReq.open('POST', '/_payment/create/', true)
            createReq.setRequestHeader('Content-Type', 'application/json')
            createReq.send(JSON.stringify({
                data: POST_DATA,
                csrf: {
                    key: localStorage.getItem(config.csrfTokenNameKey),
                    token: localStorage.getItem(config.csrfTokenName + localStorage.getItem(config.csrfTokenNameKey))
                }, 
                checksum: hmac
            }));

            createReq.onreadystatechange = () => {
                if(createReq.readyState===4 && createReq.status===200) {
                    let paymentData = JSON.parse(createReq.response)
                    let responseHmac = crypto.createHmac('sha256', config.clientKey).update(JSON.stringify(paymentData.payment)).digest('hex')            
                    if(paymentData.hash === responseHmac) {
                        localStorage.setItem('x-txn-id', paymentData.txnId)
                        this.setState({
                            amount: {
                                base: base,
                                total: amt
                            },
                            paymentId: paymentData.payment.payment_id,
                            txnId: paymentData.txnId,
                            data: {
                                payer: POST_DATA.payer,
                                eventData: POST_DATA.eventData,
                                regData: this.props.regData
                            },
                            redHotURL: paymentData.payment.longurl,
                            paymentCreated: true
                        })
                    } else
                        this.paymentError('RESPONSE_HASH_MISMATCH')
                } else if(createReq.readyState===4 && createReq.status===403) {
                    this.paymentError('CSRF_TIMEOUT')
                } else if(createReq.readyState===4 && createReq.status===500) {
                    this.paymentError('SERVER_ERROR')
                }
            }
        } else if(returnPayToken===crypto.createHmac('sha512', config.clientKey).update(returnKey + returnTxnId).digest('hex')) {
            // Payment Returned from Server
            localStorage.removeItem('x-return-key')
            localStorage.removeItem('x-return-pay-token')
            localStorage.removeItem('x-txn-id')
            /**
             * @author zrthxn
             * Check for transaction success here
             * The transaction ID is available as returnTxnId
             */
            setTimeout(()=>{
                Database.firestore.collection('transactions').doc(returnTxnId).get()
                .then((snapshot)=>{
                    let paymentData = snapshot.data()
                    if(paymentData.status==='Credit')
                        this.paymentSuccesful({ txnId: returnTxnId })
                    else
                        this.paymentError({ txnId: returnTxnId })
                }).catch(()=>{
                    this.paymentError({ txnId: null })
                })
            }, 4000)
        }
    }

    paymentSuccesful = (txn) => {
        console.log('PAYMENT_SUCCESSFUL')
        Database.firestore.collection('transactions').doc(txn.txnId).update({
            status: 'SUCCESS | VERIFIED',
            verified: true
        }).then(()=>{
            let hashSequence = JSON.stringify(this.state.data.regData)
            let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')

            if(this.state.data.eventData.type==='com') {
                Booking.competeRegister(this.state.data.regData, hmac, txn.txnId).then((res)=>{
                    if (res.validation) 
                        this.setState({ completion: true, paymentSuccesful: true, rgn: res.rgn })
                }).catch(()=>{
                    alert('Payment Recieved. Registration Error. Please take a screenshot of this message and contact us :: ' + txn.txnId)
                })
            } else if(this.state.data.eventData.type==='tic') {
                Booking.ticketRegister(this.state.data.regData, hmac, txn.txnId).then((res)=>{
                    if (res.validation) 
                        this.setState({ completion: true, paymentSuccesful: true, rgn: res.rgn })
                }).catch(()=>{
                    alert('Payment Recieved. Registration Error. Please take a screenshot of this message and contact us :: ' + txn.txnId)
                })
            }
        }).catch((err)=>{
            console.error(err);
        })
    }

    paymentCancelled = () => {
        console.log('PAYMENT_CANCELLED')
        Database.firestore.collection('transactions').doc(this.state.txnId).update({
            status: 'CANCELLED',
        }).then(()=>{
            this.props.back()
        }).catch((err) => console.error(err))
    }

    paymentError = (txn) => {
        console.error('PAYMENT_FAILED', 'PORTAL_ERROR')
        localStorage.setItem('payment-error-code', 'PORTAL_ERROR')
        Database.firestore.collection('transactions').doc(txn.txnId).update({
            status: 'FAILED | VERIFIED',
        }).then(()=>{
            this.setState({ paymentCreated: false })
        }).catch((err) => console.error(err))
    }

    action = () => {
        // Redirect to action URL here
        let returnKey = 'KEY'
        for(let i=0;i<24;i++)
            returnKey += Math.floor( Math.random() * 36 ).toString(36)
        let returnPayToken = crypto.createHmac('sha512', config.clientKey).update(returnKey + this.state.txnId).digest('hex')

        localStorage.setItem('x-return-key', returnKey)
        localStorage.setItem('x-return-pay-token', returnPayToken)

        window.location = this.state.redHotURL
    }


    render() {
        return (
            <div className="Payments container fit">
            {
                this.state.paymentCreated ? (
                    this.state.completion ? (
                        this.state.paymentSuccesful ? <SuccessPage rgn={ this.state.rgn } payment={true}/> : <ErrorPage/>
                    ) : (
                        <div>
                            <h2>Payments Page</h2>

                            <div className="action container fit">
                                <button className="button" onClick={ this.props.back.bind(this) }>CANCEL</button>
                            </div>

                            <div className="pricing">
                                <p>Total</p>
                                <h3>{'\u20B9 ' + Booking.calcTaxInclAmount(this.props.amount)}</h3>
                                <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                            </div>

                            <button className="button solid green" onClick={this.action}>PAY</button>
                        </div>
                    )
                ) : (
                    <LoadingPage timeOut={5000}/>
                )
            }
            </div>
        );
    }
}

export default Payments;