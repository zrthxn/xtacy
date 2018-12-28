// const firebase = require('firebase');
const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');
require('firebase/firestore');
const clientKey = require('./config.json').clientKey;

const credsReq = new XMLHttpRequest();
credsReq.open('GET', 'http://xtacy.org:3000/_secu/firebase/' + btoa(clientKey).replace(/=/g,'') + '/GET/', true);
credsReq.send();
credsReq.onreadystatechange = () => {
    if(credsReq.readyState===4 && credsReq.status===200) {
        let credentials = JSON.parse(credsReq.response);
        if (firebase.apps.length===0) {
            firebase.initializeApp(credentials);
            exports.firebase = firebase;
            exports.database = firebase.database();
            exports.firestore = firebase.firestore().settings({ timestampsInSnapshots: true });
            
            delete credsReq.response;
            // delete credentials.all;
        }
    }
}

/**
* @author Alisamar Husain
* 
* Standard Firebase/Firestore Export
* ---------------------------------
* Import the object by either
*   const db = require('./Database')
* or
*   import db from './Database';
* 
* Use the object to get a database
* namespace by 'db.firebase.database()'
* Check the firebase docs for more.
*/