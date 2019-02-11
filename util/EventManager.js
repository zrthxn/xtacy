const fs = require('fs');
const Gmailer = require('./Gmailer');
const GSheets = require('./GSheets');
const ServerConfig = require('../config.json');
const ContentDelivery = require('./ContentDelivery');
const Database = require('./Database').firestore;
const crypto = require('crypto');
const barcodeGenerator = require('bwip-js');
const database = require('./Database').database;

exports.getEventData = (__eventId) => {
    return new Promise((resolve,reject)=>{
        database.ref('/eventLookup/events/'+__eventId).once('value', (snapshot) => {
            resolve(snapshot.val());
        })
    })     
}

exports.generalRegister = (data) => {
    return new Promise((resolve,reject)=>{
        generateRegistrationID('gen',1).then((rgnId) => {  
        GSheets.AppendToSpreadsheet([
                {
                    ssId: ServerConfig.Sheets.spreadsheets.registrations,
                    sheet: 'GEN',
                    values: [
                        rgnId, data.regName, data.regEmail, data.regPhone, data.regInst
                    ]
                }
            ]).then(()=>{
                generateHashedBarcode(rgnId, 'pdf417').then((url)=>{
                    Gmailer.SingleDataDelivery(
                        {
                            to: data.regEmail,
                            from: 'hello@xtacy.org',
                            subject: 'Registration Confirmation | Team Xtacy',
                        }, 
                        fs.readFileSync('./mail/templates/generalRegConfirmation.html').toString(),
                        [
                            { id: 'regName', data: data.regName },
                            { id: 'rgn', data: rgnId },
                            { id: 'url', data: url }
                        ]
                    ).then(()=>{
                        console.log('New Registration', rgnId)
                        resolve(rgnId)
                    })                
                }).catch((err)=> console.error(err))   
            }).catch((err)=>{
                reject(err)
            })
        })
    })
}

exports.competeRegister = (data, txn) => {
    return new Promise((resolve,reject)=>{
    generateRegistrationID(data.eventId, data.members.length).then( (rgnId) => {
        let teamLeader = data.regTeamLeader===undefined ? data.members[0].name : data.regTeamLeader
        
        if(txn === 'NON_PAID') txn = ServerConfig.clientKey
        validateTransaction(txn).then((r)=>{            
            if(!r) reject()
            GSheets.AppendToSpreadsheet([
                {
                    ssId: ServerConfig.Sheets.spreadsheets.registrations,
                    sheet: data.eventId.toUpperCase(),
                    values: [
                        rgnId, data.regTeamName, data.regTeamEmail, data.regTeamPhone, data.regTeamInst,
                        data.regTeamGit, teamLeader, data.regTeamSize, 
                        ...data.members
                    ]
                }
            ]).then(()=>{
                generateHashedBarcode(rgnId, 'pdf417').then((url)=>{
                    Gmailer.SingleDataDelivery(
                        {
                            to: data.regTeamEmail,
                            from: 'hello@xtacy.org',
                            subject: 'Registration Confirmation | Team Xtacy',
                        }, 
                        fs.readFileSync('./mail/templates/competeRegConfirmation.html').toString(),
                        [
                            { id: 'regTeamName', data: data.regTeamName },
                            { id: 'teamLeader', data: teamLeader },
                            { id: 'rgn', data: rgnId },
                            { id: 'url', data: url }
                        ]
                    ).then(()=>{
                        console.log('New Registration', rgnId)
                        resolve(rgnId)
                    })
                }).catch((err)=> console.error(err))   
            }).catch((err)=>{
                reject(err)
            })
        })
    })
})
}


exports.ticketRegister = (data, txn) => {
    return new Promise((resolve,reject)=>{
        generateRegistrationID(data.eventId, data.number).then((rgnId) => {
            if(txn === 'NON_PAID') txn = ServerConfig.clientKey
            validateTransaction(txn).then((r)=>{
                if(!r) reject()
                GSheets.AppendToSpreadsheet([
                    {
                        ssId: ServerConfig.Sheets.spreadsheets.registrations,
                        sheet: data.eventId.toUpperCase(),
                        values: [
                            rgnId, data.regName, data.regEmail, data.regPhone, data.regInst, 
                            data.number, data.tier, data.specialRequests
                        ]
                    }
                ]).then(()=>{
                    generateHashedBarcode(rgnId, 'pdf417').then((url)=>{
                        Gmailer.SingleDataDelivery(
                            {
                                to: data.regTeamEmail,
                                from: 'hello@xtacy.org',
                                subject: 'Registration Confirmation | Team Xtacy',
                            }, 
                            fs.readFileSync('./mail/templates/ticketRegConfirmation.html').toString(),
                            [
                                { id: 'regName', data: data.regName },
                                { id: 'tier', data: data.tier },
                                { id: 'number', data: data.number },
                                { id: 'rgn', data: rgnId },
                                { id: 'url', data: url }
                            ]
                        ).then(()=>{
                            console.log('New Registration', rgnId)
                            resolve(rgnId)
                        })
                    }).catch((err)=> console.error(err))
                }).catch((err)=>{
                    reject(err)
                })
            })
        })  
    })
}

exports.findEventById = (__eventId) => {
    return new Promise((resolve,reject)=>{
        database.ref('/eventLookup/events'+ __eventId).once('value', (snapshot) => {
            eventData = snapshot.val();
            if(eventData!=null) {
                fs.readFile('./eventRegistry/content/' + eventData.eventId + '.html', (err, content)=> {
                    if (err) {
                        console.log(err)
                        reject({ errors : err })
                    } else {
                        content = content.toString()
                        resolve({
                            success : true,
                            title :  eventData.title,
                            content : content,
                            data: eventData
                        })
                    }
                })
            } else {
                resolve({ success : false })
            }
        })
    })
}

exports.findEventPromoById = (__eventId) => {
    return new Promise((resolve,reject)=>{
        database.ref('/eventLookup/events/'+ __eventId).once('value', (snapshot) =>{
            eventData = snapshot.val();
            if(eventData!=null) {
                fs.readFile('./eventRegistry/promos/' + eventData.eventId + '.html', (err, content)=> {
                    if (err) {
                        console.log(err)
                        reject({ errors : err })
                    } else {
                        content = content.toString()
                        resolve({
                            success : true,
                            title :  eventData.title,
                            content : content,
                            data : eventData
                        })
                    }
                })
            } else {
                resolve({ success : false })
            }
        })
    })
}

function validateTransaction (txnID) {
    return new Promise((resolve,reject)=>{
        if(txnID === ServerConfig.clientKey) resolve(true)
        Database.collection('transactions').doc(txnID)
            .get()
            .then((txn)=>{
                if(txn.txnID === txnID)
                    if(txn.status === 'SUCCESS')
                        resolve(true)
                    else
                        resolve(false)
            }).catch(()=>{
                reject()
            })
    })    
}

// =========================================== //

function generateRegistrationID(__eventId, nH) {
    return new Promise((resolve,reject) => {
        let regId = '', desgn = '', date = new Date()
        let day = date.getDate()>=10 ? (date.getDate()).toString() : '0' + (date.getDate()).toString() 
        let month = date.getMonth()>=9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString() 

        database.ref('/eventLookup/registrationRefNumber').once('value').then((snapshot) => {
            registrationRefNumber = snapshot.val();
            if(__eventId==='gen')
                desgn = 'GENR3E'
            else
                desgn = __eventId.toUpperCase();
            
            let regRef = (parseInt(registrationRefNumber) + 1).toString(16).toUpperCase(), k = 4 - regRef.length
            for (let i=0; i<k; i++)
                regRef = '0' + regRef

            nH = (nH>=10) ? nH.toString() : '0' + nH.toString()

            regId = desgn + day + month + nH + regRef

            registrationRefNumber = '0x' + regRef
            database.ref('/eventLookup').update({ "registrationRefNumber": registrationRefNumber})
            resolve(regId)
        }).catch((err)=>{
            reject(err)
        })
    })
}

function generateHashedBarcode(rgn, type) {
    return new Promise((resolve,reject)=>{
        text = rgn + crypto.createHash('md5').update(rgn).digest('hex').toUpperCase()
        barcodeGenerator.toBuffer({ bcid: type, text: text }, (err, barcode) => {
            if (err) reject(err)
            else {
                ContentDelivery.Create(barcode, rgn + '.png', 'root/registrations/barcodes', 'image/png', {
                    "unixTime": (new Date()).getTime(),
                    "rgn": rgn
                }).then((ref)=>{
                    console.log('Barcode Generated', type, rgn)
                    resolve('https://cdn.xtacy.org/d/' + ref)
                })
            }
        })
    })    
}
