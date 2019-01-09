const fs = require('fs');
const Gmailer = require('./Gmailer');
const GSheets = require('./GSheets');
const eventLookup = require('../eventRegistry/eventLookup.json');
const ServerConfig = require('../config.json');
const database = require('./Database');

exports.getEventData = (__eventId) => {
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
    let rgnId = generateRegistrationID('gen', 1)

    return new Promise((resolve,reject)=>{
        GSheets.AppendToSpreadsheet([
            {
                ssId: ServerConfig.Sheets.spreadsheets.registrations,
                sheet: 'General',
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
            )
        }).then(()=>{
            resolve(rgnId)
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.competeFreeRegister = (data) => {
    let rgnId = generateRegistrationID(data.eventId, data.members.length)

    return new Promise((resolve,reject)=>{
        GSheets.AppendToSpreadsheet([
            {
                ssId: ServerConfig.Sheets.spreadsheets.registrations,
                sheet: 'Competitions',
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
            )
        }).then(()=>{
            resolve(rgnId)
        }).catch((err)=>{
            reject(err);
        });
    });
}

// -----------------------------

exports.addNewEvent = () => {
    // Add new event to eventRegistry
}

exports.findEventById = (__eventId) => {
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
        desgn = 'GENRA1'
    else
        for (const event of registry.events) {
            if (event.eventId===__eventId) {
                desgn = event.designator;
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

}