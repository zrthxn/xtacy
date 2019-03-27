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

exports.CreateNewPayment = (data) => {
    return new Promise((resolve,reject)=>{
        registerNewTxn(data).then((txnId)=>{
            resolve({
                txnId: txnId,
                API_KEY : API_KEY,
                SALT : SALT,
                AUTH_TOKEN : AUTH_TOKEN,
                SURL : SURL,
                FURL: FURL,
                URI : URI,
                hash: crypto.createHmac('sha256', ServerConfig.clientKey).update(AUTH_TOKEN).digest('hex'),
                success: true
            })
        })
    }).catch((err)=>{
        console.log(err)
    })
}