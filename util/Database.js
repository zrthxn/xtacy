const firebase = require('../node_modules/firebase/');
const DatabaseConfig = require('../config.json');

firebase.initializeApp(DatabaseConfig.firebase);

// const firestore = firebase.firestore();
// firestore.settings({ timestampsInSnapshots: true });

// exports.firestore = firestore;
exports.firebase = firebase;

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
* 
* Check the firebase docs for more.
*/