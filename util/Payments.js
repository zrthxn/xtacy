/** Payments Module */

const fs = require('fs');
const request = require('request');
const crypto = require('crypto');
const ServerConfig = require('../config.json');

const env = require('../config.json').payments.env;

const { CLIENT, SECRET, AUTH_CREDS, PAYPAL_API, EXP_PROFILE_ID } = require('../config.json').payments[env];

exports.authorizeNewPayment = (params) => {
    var { ACCESS_TOKEN, validity } = JSON.parse(fs.readFileSync('./config.json').toString()).payments[env].access_token
    if(((validity - (new Date()).getTime()) < 0) || ACCESS_TOKEN===null)
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
                experience_profile_id: EXP_PROFILE_ID
            }
        }, function(err, res) {
            if (err) return reject({ success: false })
            // console.log(res.body)
            resolve({
                success: true,
                data : Buffer.from(JSON.stringify({
                    payment: res.body,
                    txnid: 'XTACY1234567890',
                    client: CLIENT,
                    hash: crypto.createHmac('sha256', ServerConfig.clientKey).update(JSON.stringify(res.body)).digest('hex')
                }), 'ascii').toString('base64')
            })
        })
    })
}

exports.executePayment = ({ paymentID, payerID }) => {
    var { ACCESS_TOKEN, validity } = JSON.parse(fs.readFileSync('./config.json').toString()).payments[env].access_token
    if(((validity - (new Date()).getTime()) < 0) || ACCESS_TOKEN===null)
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
                success: true,
                data : Buffer.from(JSON.stringify({
                    payment: res.body,
                    txnid: 'XTACY1234567890',
                    hash: crypto.createHmac('sha256', ServerConfig.clientKey).update(JSON.stringify(res.body)).digest('hex')
                }), 'ascii').toString('base64')
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

    var { ACCESS_TOKEN, validity } = JSON.parse(fs.readFileSync('./config.json').toString()).payments[env].access_token
    if(((validity - (new Date()).getTime()) < 0) || ACCESS_TOKEN===null)
        ACCESS_TOKEN = getNewAccessToken()

    return request.post(PAYPAL_API + '/v1/payment-experience/web-profiles/', {
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + ACCESS_TOKEN
        },
        body: experience
    }, function(err, response) {
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
        if(res.body.error) return console.error(res.body)
        let _validity = (res.body.expires_in*1000) + (new Date()).getTime()
        console.log(res.body.app_id, 'NEW_ACCESS_TOKEN', res.body.access_token)
        let config = JSON.parse(fs.readFileSync('./config.json').toString())
        config.payments[env].access_token = {
            ACCESS_TOKEN: res.body.access_token,
            validity: _validity
        }
        console.log('WARNING :: Writing Config File')
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
        return res.body.access_token
    })
}

function registerTXN() {
    // add entry to firebase with
    // payment: { status: 'pending' }
    // then after success, the server will chnage that to 'success' 
}