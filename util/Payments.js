/**
 * @author zrthxn
 * Payments Module
 */

const fs = require('fs');
const request = require('request');
const PAYPAL_API = 'https://api.sandbox.paypal.com';
const DEFAULT_EXP_PROFILE = 'XP-EVCB-2CWP-DA35-MTZN';

const { CLIENT, SECRET, AUTH_CREDS } = require('../config.json').payments;

exports.authorizeNewPayment = (params) => {
    var { ACCESS_TOKEN, validity } = JSON.parse(fs.readFileSync('../config.json').toString()).payments.access_token
    if((validity - (new Date()).getTime()) < 0)
        ACCESS_TOKEN = getNewAccessToken()

    return new Promise((resolve,reject)=>{
        request.post(PAYPAL_API + '/v1/payments/payment', {
            json: true,
            headers: {
                Authorization: 'Bearer ' + ACCESS_TOKEN
            },
            body: {
                intent: "sale",
                payer: {
                    payment_method: "paypal",
                    payer_info: {}
                },
                transactions: [
                    {
                        amount: {
                            total: params.amount.total,
                            currency: "INR",
                            details: {
                                subtotal: params.amount.base,
                                tax: params.amount.tax,
                                shipping: "0",
                                handling_fee: "0",
                                shipping_discount: "0",
                                insurance: "0"
                            }
                        },
                        description: params.eventData.eventDescription,
                        invoice_number: "XTACY123456",
                        payment_options: {
                            allowed_payment_method: "INSTANT_FUNDING_SOURCE"
                        }
                    }
                ],
                redirect_urls: {
                    return_url: 'https://xtacy.org/succ',
                    cancel_url: 'https://xtacy.org/fails'
                },
                experience_profile_id: DEFAULT_EXP_PROFILE
            }
        }, function(err, res) {
            if (err) return reject({ success: false })
            resolve({
                success: true,
                id: res.body.id,
                txnid: 'XTACY1234567890',
                client: CLIENT
            })
        })
    })
}

exports.executePayment = ({ paymentID, payerID }) => {
    var { ACCESS_TOKEN, validity } = JSON.parse(fs.readFileSync('../config.json').toString()).payments.access_token
    if((validity - (new Date()).getTime()) < 0)
        ACCESS_TOKEN = getNewAccessToken()
    
    return new Promise((resolve,reject)=>{
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute', {
            json: true,
            headers: {
                Authorization: 'Bearer ' + ACCESS_TOKEN
            },
            body: {
                payer_id: payerID
            }
        }, function(err, res) {
            if (err) return reject({ success: false })
            resolve({
                success: true
            })
        })
    })    
}

exports.registerExperienceProfile = (experience) => {
    const DEFAULT = {
        name: "xtacyPaymentProfile",
        input_fields: {
            no_shipping: 1
        },
        flow_config: {
            landing_page_type: "Billing",
            user_action: "commit"
        },
        presentation: {
            brand_name: "Xtacy",
            logo_image: "https://cdn.xtacy.org/d/5p05"
        }
    }
    if(experience===undefined) experience = DEFAULT

    var { ACCESS_TOKEN, validity } = JSON.parse(fs.readFileSync('../config.json').toString()).payments.access_token
    if((validity - (new Date()).getTime()) < 0)
        ACCESS_TOKEN = getNewAccessToken()

    return request.post(PAYPAL_API + '/v1/payment-experience/web-profiles/', {
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + ACCESS_TOKEN
        },
        body: experience
    }, function(err, response)
        {
        if (err) return console.error(err)
        console.log(response.body)
    })
}

function getNewAccessToken() {
    return request.post(PAYPAL_API + '/v1/oauth2/token', {
        'headers': {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'cache-control': 'no-cache',
            'Authorization' : 'Basic ' + AUTH_CREDS
        },
        'form': {
            'grant_type': 'client_credentials'
        },
        'json': true
    }, function(err, res) {
        if(err) return console.error(err)
        let _validity = (res.body.expires_in*1000) + (new Date()).getTime()
        console.log('WARNING :: Reading Config File')
        let config = JSON.parse(fs.readFileSync('../config.json').toString())
        config.payments.access_token = {
            ACCESS_TOKEN: res.body.access_token,
            validity: _validity
        }
        console.log('WARNING :: Writing Config File')
        fs.writeFileSync('../config.json', JSON.stringify(config, null, 4))
        console.log('DONE')
        return res.body.access_token
    })
}

function registerTXN() {
    // add entry to firebase with
    // payment: { status: 'pending' }
    // then after success, the server will chnage that to 'success' 
}