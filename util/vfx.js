const Database = require('./Database').firestore
const EventManager = require('./EventManager')

exports.verify = (arr) => {
    arr.forEach(ack => {
        Database.collection('acknowledgments').doc(ack).get().then((snapshot) => {
            let dbData = snapshot.data()
            if(dbData!=null){
                    EventManager.generalRegister(dbData).then(() =>{
                        Database.collection('verified').doc(ack).set(dbData).then(() =>{
                            Database.collection('acknowledgments').doc(ack).delete().then(() => {
                                console.log("REGISTRATION VERFIED")
                        })
                    })
                })
            } else {
                console.log(ack + "Doesnt exist")
            }   
        })
    })
}