const fs = require('fs');
const Gmailer = require('./Gmailer');
const GSheets = require('./GSheets');
const ServerConfig = require('../config.json');
const ContentDelivery = require('./ContentDelivery');
const database = require('./Database');
const barcodeGenerator = require('bwip-js');

exports.getEventData = (__eventId) => {
    const eventLookup = JSON.parse(fs.readFileSync('./eventRegistry/eventLookup.json').toString())
    return new Promise((resolve,reject)=>{
        var eventData = null;
        for(let event of eventLookup.events) {
            if (event.eventId===__eventId) {
                eventData = event;
                break;
            }
        }
        resolve(eventData);
    });
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
            Gmailer.SingleDataDelivery(
                {
                    to: data.regEmail,
                    from: 'hello@xtacy.org',
                    subject: 'Registration Confirmation | Team Xtacy',
                }, 
                'Registration Acknowledgement Email :: $regName$ $regPhone$ $regInst$',
                [
                    { id: 'regName', data: data.regName },
                    { id: 'regPhone', data: data.regPhone },
                    { id: 'regInst', data: data.regInst }
                ]
            ).then(()=>{
                console.log('New Registration :', rgnId)
                resolve(rgnId)
            })
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.competeRegister = (data) => {
    var rgnId = generateRegistrationID(data.eventId, data.members.length)

    return new Promise((resolve,reject)=>{
        GSheets.AppendToSpreadsheet([
            {
                ssId: ServerConfig.Sheets.spreadsheets.registrations,
                sheet: data.eventId.toUpperCase(),
                values: [
                    rgnId, data.regTeamName, data.regTeamEmail, data.regTeamInst,
                    //...data.members
                ]
            }
        ]).then(()=>{
            Gmailer.SingleDataDelivery(
                {
                    to: data.regTeamEmail,
                    from: 'hello@xtacy.org',
                    subject: 'Registration Confirmation | Team Xtacy',
                }, 
                'Registration Acknowledgement Email :: $regTeamName$ $regTeamInst$ $rgn$',
                [
                    { id: 'regTeamName', data: data.regTeamName },
                    { id: 'regTeamInst', data: data.regTeamInst },
                    { id: 'rgn', data: rgnId }
                ]
            ).then(()=>{
                console.log('New Registration :', rgnId)
                resolve(rgnId)
            })
        }).catch((err)=>{
            reject(err);
        });
    });
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
                    console.log(err);
                    reject({ errors : err });
                } else {
                    content = content.toString();
                    resolve({
                        success : true,
                        title :  eventData.title,
                        content : content,
                        data: eventData
                    });
                }
            });
        } else {
            resolve({ success : false });
        }
    });
}

exports.findEventPromoById = (__eventId) => {
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
            fs.readFile('./eventRegistry/promos/' + eventData.eventId + '.html', (err, content)=> {
                if (err) {
                    console.log(err);
                    reject({ errors : err });
                } else {
                    content = content.toString();
                    resolve({
                        success : true,
                        title :  eventData.title,
                        content : content,
                        data : eventData
                    });
                }
            });
        } else {
            resolve({ success : false });
        }
    });
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
                desgn = event.eventId.toUpperCase();
                break;
            }
        }
    
    let regRef = (parseInt(registry.registrationRefNumber) + 1).toString(16).toUpperCase(), k = 4 - regRef.length
    for (let i=0; i<k; i++)
        regRef = '0' + regRef

    nH = (nH>=10) ? nH.toString() : '0' + nH.toString()

    regId = desgn + day + month + nH + regRef

    registry.registrationRefNumber = '0x' + regRef
    fs.writeFileSync('./eventRegistry/eventLookup.json', JSON.stringify(registry, null, 4))

    return regId
}

function generateHashedBarcode(data, type) {
    barcodeGenerator.arguments()
    return ContentDelivery.Upload(barcode, rgn, 'root/registrations/barcodes', 'image/png', {
            "date" : (new Date()).getDate()
        }).then((ref)=>{
            return ({ url: 'cdn.xtacy.org/d/' + ref })
        })
}