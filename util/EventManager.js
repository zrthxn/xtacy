const fs = require('fs');
const Gmailer = require('./Gmailer');
const GSheets = require('./GSheets');
const ServerConfig = require('../config.json');
const ContentDelivery = require('./ContentDelivery');
const Database = require('./Database').firestore;
const crypto = require('crypto');
const barcodeGenerator = require('bwip-js');

exports.getEventData = (__eventId) => {
    const eventLookup = JSON.parse(fs.readFileSync('./eventRegistry/eventLookup.json').toString())
    return new Promise((resolve,reject)=>{
        var eventData = null
        for(let event of eventLookup.events) {
            if (event.eventId===__eventId) {
                eventData = event
                break
            }
        }
        resolve(eventData)
    })
}

exports.generalRegister = (data) => {
    var rgnId = generateRegistrationID('gen', 1)

    return new Promise((resolve,reject)=>{
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
}

exports.competeRegister = (data, txn) => {
    var rgnId = generateRegistrationID(data.eventId, data.members.length)

    return new Promise((resolve,reject)=>{
        let teamLeader = data.regTeamLeader===null ? data.members[0].name : data.regTeamLeader
        
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
}

exports.ticketRegister = (data, txn) => {
    var rgnId = generateRegistrationID(data.eventId, data.number)

    return new Promise((resolve,reject)=>{
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
}

exports.findEventById = (__eventId) => {
    const eventLookup = JSON.parse(fs.readFileSync('./eventRegistry/eventLookup.json').toString())
    return new Promise((resolve,reject)=>{
        var eventData = null;
        for(let event of eventLookup.events) {
            if (event.eventId===__eventId) {
                eventData = event;
                break;
            }
        }
        
        if(eventData!=undefined) {
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
}

exports.findEventPromoById = (__eventId) => {
    const eventLookup = JSON.parse(fs.readFileSync('./eventRegistry/eventLookup.json').toString())
    return new Promise((resolve,reject)=>{
        var eventData = null
        for(let event of eventLookup.events) {
            if (event.eventId===__eventId) {
                eventData = event
                break
            }
        }
        
        if(eventData!=undefined) {
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
    let regId = '', desgn = '', date = new Date()
    let day = date.getDate()>=10 ? (date.getDate()).toString() : '0' + (date.getDate()).toString() 
    let month = date.getMonth()>=9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString() 

    let registry = JSON.parse(fs.readFileSync('./eventRegistry/eventLookup.json').toString())
    if(__eventId==='gen')
        desgn = 'GENR3E'
    else
        for (const event of registry.events) {
            if (event.eventId===__eventId) {
                desgn = event.eventId.toUpperCase()
                break
            }
        }
    
    let regRef = (parseInt(registry.registrationRefNumber) + 1).toString(16).toUpperCase(), k = 4 - regRef.length
    for (let i=0; i<k; i++)
        regRef = '0' + regRef

    nH = (nH>=10) ? nH.toString() : '0' + nH.toString()

    regId = desgn + day + month + nH + regRef

    registry.registrationRefNumber = '0x' + regRef
    fs.writeFileSync('./eventRegistry/eventLookup.json', JSON.stringify(registry, null, 2))

    return regId
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