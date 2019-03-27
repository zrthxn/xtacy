import React, { Component } from 'react';
import crypto from 'crypto';
import LoadingPage from './LoadingPage';

import Database from '../util/database';
import Booking from '../util/booking';
import './css/Payments.css';
import SuccessPage from './SuccessPage';
import ErrorPage from './ErrorPage';
import { RSA_NO_PADDING } from 'constants';

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
            hash: null,
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
                    let responseHmac = crypto.createHmac('sha256', config.clientKey).update(paymentData.AUTH_TOKEN).digest('hex')            
                    if(paymentData.hash === responseHmac) {
                        localStorage.setItem('x-txn-id', paymentData.txnId)
                        
                        let hashSequence = `${paymentData.API_KEY}|${paymentData.txnId}|${amt}|` + 
                            `${this.props.eventData.title}|${this.props.name}|${this.props.email}|` + 
                            `${'XTACY'}||||||||||${paymentData.SALT}`
                        let hash = crypto.createHash('sha512').update(hashSequence).digest('hex')

                        this.setState({
                            amount: {
                                base: base,
                                total: amt
                            },
                            hash: hash,
                            txnId: paymentData.txnId,
                            paymentData : paymentData,
                            data: {
                                payer: POST_DATA.payer,
                                eventData: POST_DATA.eventData,
                                regData: this.props.regData
                            },
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
         //   setTimeout(()=>{
                Database.firestore.collection('transactions').doc(returnTxnId).get()
                .then((snapshot)=>{
                    let paymentData = snapshot.data()
                    if(paymentData.status==='success')
                        this.paymentSuccesful({ txnId: returnTxnId })
                    else
                        this.paymentError({ txnId: returnTxnId })
                }).catch(()=>{
                    this.paymentError({ txnId: null })
                })
        //    }, 2500)
        }
    }

    paymentSuccesful = (txn) => {
        console.log('PAYMENT_SUCCESSFUL')
        const { regData, eventData } = JSON.parse(atob(sessionStorage.getItem('x-data-bundle')))
        sessionStorage.removeItem('x-data-bundle')
        Database.firestore.collection('transactions').doc(txn.txnId).update({
            status: 'SUCCESS | VERIFIED',
            verified: true
        }).then(()=>{
            let hashSequence = JSON.stringify(regData)
            let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')

            if(eventData.type==='com') {
                Booking.competeRegister(regData, hmac, txn.txnId).then((res)=>{
                    if (res.validation) 
                        this.setState({ paymentCreated: true, completion: true, paymentSuccesful: true, rgn: res.rgn })
                }).catch(()=>{
                    alert('Payment Received. Registration Error. Please take a screenshot of this message and contact us :: ' + txn.txnId)
                })
            } else if(eventData.type==='tic') {
                Booking.ticketRegister(regData, hmac, txn.txnId).then((res)=>{
                    if (res.validation) 
                        this.setState({ paymentCreated: true, completion: true, paymentSuccesful: true, rgn: res.rgn })
                }).catch(()=>{
                    alert('Payment Received. Registration Error. Please take a screenshot of this message and contact us :: ' + txn.txnId)
                })
            } else if (eventData.type==='gen'){
                Booking.generalRegister(regData, hmac, txn.txnId).then((res) => {
                    if(res.validation)
                        this.setState({ paymentCreated: true, completion:true, paymentSuccesful:true, rgn: res.rgn })
                }).catch(() => {
                    alert('Payment Received. Registration Error. Please take a screenshot of this message and contact us :: ' + txn.txnId)
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
        sessionStorage.setItem('x-data-bundle', btoa(JSON.stringify(this.state.data)))
        //here send the form to paymentData.URI
        document.getElementById('payForm').submit()
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
                            <div className="action container fit">
                                <button className="button" onClick={ this.props.back.bind(this) }>CANCEL</button>
                            </div>
                            <form action={this.state.paymentData.URI} method="POST" name="payForm" id="payForm">
                                <input type ="hidden" name="key" value={this.state.paymentData.API_KEY} />
                                <input type="hidden" name="hash" value={this.state.paymentData.hash} /> 
                                <input type="hidden" name="txnid" value={this.state.paymentData.txnId} />
                                <input type="hidden" name="firstname" value={this.props.name} />                                
                                <input type="hidden" name="service_provider" value="payu_paisa" />
                                <input type="hidden" name="amount" value ={this.state.amount.total} />
                                <input type="hidden" name="email" value={this.props.email} />
                                <input type="hidden" name="phone" value={this.props.phone} />
                                <input type="hidden" name="productinfo" value={this.props.eventData.title} />
                                <input type="hidden" name="surl" value={this.state.paymentData.SURL} />
                                <input type="hidden" name="furl" value={this.state.paymentData.FURL} />
                                <input type="hidden" name="udf1" value="XTACY"/>
                                <input type="hidden" name="hash" value={this.state.hash} />
                                    <div className="pricing">
                                        <p>Total</p>
                                        <h3>{'\u20B9 ' + Booking.calcTaxInclAmount(this.props.amount)}</h3>
                                        <p id="tax"><i>Incl. of 18% GST and 2.5% fees</i></p>
                                    </div>
                                    <p>
                                        By clicking on PAY you agree to the Xtacy terms and conditions.
                                    </p>
                                <button className="button solid green" type="button" onClick = {this.action.bind(this)}>PAY</button>
                            </form> 
                        </div>
                    )
                ) : (
                    <LoadingPage timeOut={10000}/>
                )
            }
            </div>
        );
    }
}

export default Payments;