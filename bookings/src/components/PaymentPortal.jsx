import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
        // const authorizePayment = (data, actions) => {
        //     // return actions.request.post('/my-api/create-payment/')
        //     //     .then((res) => {
        //     //         return res.id
        //     //     })
        //     // paypal.rest.payment.create(this.props.env, this.props.clientId, {
        //     //         transactions: [
        //     //             {
        //     //                 amount: {
        //     //                     total: '',
        //     //                     currency: 'INR', //this.props.currency,
        //     //                 }
        //     //             },
        //     //         ],
        //     // })
        // }

        const { authorizedPayment } = this.props

        const executePayment = (data, actions) => {
            return actions.request.post('/_payment/execute/', {
                paymentID: data.paymentID,
                payerID: data.payerID,
                csrf: {
                    key: localStorage.getItem(config.csrfTokenNameKey),
                    token: localStorage.getItem(config.csrfTokenName + localStorage.getItem(config.csrfTokenNameKey))
                }
            }).then(() => {
                this.props.onSuccess({
                    paid: true,
                    cancelled: false,
                    paymentData: data
                })
            })
            // actions.payment.execute().then(() => {
            //     this.props.onSuccess({
            //         paid: true,
            //         cancelled: false,
            //         paymentData: data
            //     })
            // })
        }

        const buttonStyle = {
            layout: 'vertical', // horizontal | vertical
            size: 'large', // medium | large | responsive
            shape: 'rect', // pill | rect
            color: 'blue' // gold | blue | silver | white | black
        }

        return (
            <div>
            {
                this.state.showButton ? (
                    <this.state.paypal.Button.react
                        style={ buttonStyle }
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