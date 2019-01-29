import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import crypto from 'crypto';
import scriptLoader from 'react-async-script-loader';
import Loading from './partials/Loading';

const config = require('../util/config.json');

class PaymentPortal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paypal: null,
            showButton: false
        }
        window.React = React;
        window.ReactDOM = ReactDOM;
    }

    componentDidMount() {
        if(window.paypal) {
            const { isScriptLoaded, isScriptLoadSucceed } = this.props
            if (isScriptLoaded && isScriptLoadSucceed)
                this.setState({ showButton: true, paypal: window.paypal })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isScriptLoaded, isScriptLoadSucceed } = nextProps
        const isLoadedButWasntLoadedBefore = (!this.state.showButton) && (!this.props.isScriptLoaded) && (isScriptLoaded)
        if (isLoadedButWasntLoadedBefore)
          if (isScriptLoadSucceed) 
            this.setState({ showButton: true, paypal: window.paypal })
    }

    render() {
        const authorizedPayment = () => { return this.props.authorizedPayment }

        const executePayment = (data, actions) => {
            let POST_DATA = {
                paymentID: this.props.authorizedPayment,
                payerID: this.props.txnid
            }

            let hashSequence = JSON.stringify(POST_DATA)
            let hmac = crypto.createHmac('sha256', config.clientKey).update(hashSequence).digest('hex')
            
            const execReq = new XMLHttpRequest()
            execReq.open('POST', 'http://xtacy.org:3000/_payment/execute/', true)
            execReq.setRequestHeader('Content-Type', 'application/json')
            execReq.send(JSON.stringify({
                data: POST_DATA, 
                csrf: {
                    key: localStorage.getItem(config.csrfTokenNameKey),
                    token: localStorage.getItem(config.csrfTokenName + 
                        localStorage.getItem(config.csrfTokenNameKey))
                },
                checksum: hmac
            }));

            execReq.onreadystatechange = () => {
                if(execReq.readyState===4 && execReq.status===200) {
                    let executedPayment = JSON.parse(atob(JSON.parse(execReq.response).data))
                    let responseHmac = crypto.createHmac('sha256', config.clientKey).update(JSON.stringify(executedPayment.payment)).digest('hex')
                    if(executedPayment.hash === responseHmac)
                        this.props.onSuccess({
                            paid: true,
                            cancelled: false,
                            paymentData: data
                        })
                    else
                        this.paymentError('RESPONSE_HASH_MISMATCH')
                }
            }
        }

        const buttonStyle = {
            label: 'buynow',
            layout: 'vertical', // horizontal | vertical
            size: 'medium', // medium | large | responsive
            shape: 'rect', // pill | rect
            color: 'blue', // gold | blue | silver | white | black
            branding: true // optional
        }

        return (
            <div>
            {
                this.state.showButton ? (
                    <this.state.paypal.Button.react
                        style={ buttonStyle }
                        funding= {
                            {
                                allowed: [
                                    this.state.paypal.FUNDING.CARD,
                                    this.state.paypal.FUNDING.CREDIT
                                ]
                            }
                        }
                        env={this.props.env}
                        clientId={this.props.clientId}
                        commit={true}
                        payment={ authorizedPayment }
                        onAuthorize={ executePayment }
                        onCancel={this.props.onCancel}
                        onError={this.props.onError}
                    />
                ) : (
                    <Loading/>
                )
            }
            </div>
        );
    }
}

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaymentPortal);