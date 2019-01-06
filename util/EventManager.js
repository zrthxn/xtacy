const fs = require('fs');
const Gmailer = require('./Gmailer');
const GSheets = require('./GSheets');
const eventLookup = require('../eventRegistry/eventLookup.json');
const database = require('./Database');

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

exports.addNewEvent = () => {

}

exports.generalRegister = (data) => {
    return new Promise((resolve,reject)=>{
        GSheets.AppendToSpreadsheet([
            {
                ssId: ServerConfig.Sheets.spreadsheets.registrations,
                sheet: 'General',
                values: [
                    data.regName, data.regEmail, data.regPhone, data.regInst
                ]
            }
        ]).then(()=>{
            Gmailer.SingleDelivery(
                {
                    to: data.regEmail,
                    from: 'hello@xtacy.org',
                    subject: 'Registration Confirmation | Team Xtacy',
                }, 
                'Registration Acknowledgement Email $regName$ $regPhone$ $regInst$',
                [
                    { id: 'regName', data: data.regName },
                    { id: 'regPhone', data: data.regPhone },
                    { id: 'regInst', data: data.regInst }
                ]
            )
        }).then(()=>{
            resolve(true)
        }).catch((err)=>{
            reject(err);
        });
    });
}

// =========================================== //

function updateCache() {

}

function deleteFromCache() {

}

function addToCache() {

}