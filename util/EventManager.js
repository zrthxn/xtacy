const fs = require('fs');
const eventLookup = require('../eventRegistry/eventLookup.json');
const database = require('./Database');

exports.findEventById = (__eventId) => {
    return new Promise((resolve,reject)=>{
        var eventData;
        for(let i=0; i<eventLookup.events.length; i++) {
            eventData = eventLookup.events[i];
            if (eventLookup.events[i].eventId===__eventId) break;
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
        var eventData;
        for(let i=0; i<eventLookup.events.length; i++) {
            eventData = eventLookup.events[i];
            if (eventLookup.events[i].eventId===__eventId) break;
        }
        
        if(eventData!=undefined) {
            fs.readFile('./eventRegistry/promos/' + eventData.eventId + '.txt', (err, content)=> {
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

exports.findEvent = (event) => {

}

exports.addNewEvent = () => {

}

// =========================================== //

function updateCache() {

}

function deleteFromCache() {

}

function addToCache() {

}