const Database = require('./Database').firestore
const EventManager = require('./EventManager')

exports.verify = (arr) => {
    let i = 0
    function deploy() {
        setTimeout(()=>{
            Database.collection('acknowledgments').doc(arr[i]).get().then((snapshot) => {
                let dbData = snapshot.data()
                if(dbData!=null){
                    EventManager.generalRegister(dbData).then(() =>{
                        Database.collection('verified').doc(arr[i]).set(dbData).then(() =>{
                            console.log("REGISTRATION VERFIED")
                            if(i<arr.length) deploy()
                            else return
                        })
                    })
                } else {
                    console.log(arr[i] + "Doesnt exist")
                }   
            })
        }, 2000)
    }
}