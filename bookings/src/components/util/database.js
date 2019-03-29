const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');
require('firebase/firestore');

const credentials = require('./config.json').firebase;

if (firebase.apps.length===0)
    firebase.initializeApp(credentials);

exports.firebase = firebase

const database = firebase.database()
exports.database = database

const firestore = firebase.firestore()
firestore.settings({ timestampsInSnapshots: true })
exports.firestore = firestore

/**
* @author Alisamar Husain
* 
* Standard Firebase/Firestore Export
* ---------------------------------
* Import the object by either
*   const db = require('./database')
* or
*   import db from './database';
* 
* Use the object to get a database
* namespace by 'db.firebase.database()'
* Check the firebase docs for more.
*/