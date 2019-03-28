const Database = require('./Database').firestore
const EventManager = require('./EventManager')

exports.verify = (ack) => {
    Database.collection('acknowledgments').doc(ack).get().then((snapshot) => {
        let dbData = snapshot.data()
        EventManager.generalRegister(dbData).then(() =>{
            Database.collection('acknowledgments').doc(ack).delete().then(() => {
                console.log("REGISTRATION VERFIED")
            })
        })
    })
}