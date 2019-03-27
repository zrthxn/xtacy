/** Payments Module */

const fs = require('fs');
const request = require('request');
const crypto = require('crypto');

const Database = require('./Database').firestore;
const ServerConfig = require('../config.json');

const env = require('../config.json').payments.env;
const { URI, API_KEY, SALT, AUTH_TOKEN, SURL, FURL } = require('../config.json').payments[env];

function registerNewTxn (params) {
    let txnID = 'TXN', sum=0
    let pos = Math.floor( Math.random()*20 )
    for(let i=0; i<20; i++) {
        let digit = Math.floor( Math.random()*10 )
        if(i===pos)
            digit = '__'
        else
            sum += digit

        txnID += digit
    }
    
    let mod = 11 - (sum % 11)
    digit = Math.floor( Math.random()*mod )
    txnID = txnID.replace(/__/, digit.toString() + (mod-digit).toString())

    return new Promise((resolve,reject)=>{
        Database.collection('transactions').doc(txnID).set({
                status: 'CREATED',
                txnID: txnID,
                addedOn: (new Date()).getTime(),
                payer: params.payer,
                amount: {
                    base: params.amount.base,
                    tax: parseFloat(params.amount.tax),
                    total: parseFloat(params.amount.total)
                },
                eventData: params.eventData,
                verified: false
            }).then(()=>{
                resolve(txnID)
            }).catch((err)=>{
                reject('ERR_DB DatabaseError')
            })
    })
}

exports.CreateNewPayment = (params) => {
    return new Promise((resolve,reject)=>{
        registerNewTxn(params).then((txnId)=>{
            var payerName = params.payer.name.split(' ')
            var hashSequence = API_KEY+'|'+txnId+'|'+params.amount.total+'|'+params.eventData.title+'|'+payerName[0]+'|'+params.payer.email+'|||||'+''+'||||||'+SALT
            var hash = crypto.createHash('sha512').update(hashSequence).digest('hex')
            request.post({url:URI, 
                headers : {
                    'Authorisation' : AUTH_TOKEN
                },
                form : {
                    key: API_KEY,
                    txnid : txnId,
                    amount: params.amount.total,
                    productinfo: params.eventData.title,
                    firstname: payerName[0],      
                    email: params.payer.email,
                    phone: params.payer.phone,
                    surl : SURL,
                    furl: FURL,
                    hash : hash,
                    service_provider: 'payu_paisa'
                }
            }, function(err, res, body)
            /*    {          
                    if(err) reject(err)
                    if(res.statusCode===201 && body!==null) {
                        var responseData = JSON.parse(body)
                        Database.collection('transactions').doc(txnId).set({
                            txnId: txnId,
                            paymentId: '',
                            paymentRequestId: responseData.payment_request.id,
                            amount: responseData.payment_request.amount,
                            purpose: responseData.payment_request.purpose,
                            name: responseData.payment_request.buyer_name,
                            email: responseData.payment_request.email,
                            phone: responseData.payment_request.phone,
                            status: responseData.payment_request.status,
                            createdAt: responseData.payment_request.created_at,
                            modifiedAt: responseData.payment_request.modified_at
                        }).then(()=>{
                            resolve({
                                hash : crypto.createHmac('sha256', ServerConfig.clientKey).update(JSON.stringify(responseData.payment_request)).digest('hex'),
                                payment: responseData.payment_request,
                                txnId: txnId,
                                success: responseData.success
                            })
                        })
                    } else {
                        reject({ status: false })
                    }
                }       */
                {
                    if(err) reject(err)
                    if(res.statusCode >= 300 && res.statusCode <=400){
                        var _payment = {
                            amount : params.amount.total,
                            name: payerName[0],
                            email: params.payer.email,
                            phone: params.payer.phone,
                            event: params.eventData.title,

                            status: 'Created',
                        }
                        Database.collection('transactions').doc(txnId).set({
                            txnId: txnId,
                            name: payerName[0],
                            event: params.eventData.title,
                            email: params.payer.email,
                            phone: params.payer.phone,
                            status:'created',
                            amount: params.amount.total,
                            addedOn : '',
                            paymentId : '',
                            payuMoneyId: '',

                        }).then(() =>{
                            resolve({
                                hash : crypto.createHmac('sha256', ServerConfig.clientKey).update(JSON.stringify(_payment)).digest('hex'),
                                payment : _payment,
                                txnId: txnId,
                                redirectUrl : res.headers.location.toString(),
                                success: true
                            })
                        })  
                    }   
                    else {
                        reject({status : false})    
                    }   
                }
            )
        })
    })
}