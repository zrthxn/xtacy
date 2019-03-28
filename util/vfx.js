const Database = require('./Database').firestore
const EventManager = require('./EventManager')

exports.verify = (ack) => {
    Database.collection('acknowledgments').doc(ack.toString()).get().then((snapshot) => {
        let dbData = snapshot.data()
        EventManager.generalRegister(dbData).then(() =>{
            console.log("REGISTRATION VERFIED")
        })
    })
}