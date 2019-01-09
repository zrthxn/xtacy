const crypto = require('crypto');
const config = require('./config.json');

exports.validateData = (data, schema) => {

}

exports.generalRegister = (data, hash) => {
    let csrf = {
        key: localStorage.getItem(config.csrfTokenNameKey),
        token: localStorage.getItem(config.csrfTokenName + 
            localStorage.getItem(config.csrfTokenNameKey))
    };

    return new Promise((resolve,reject)=>{
        const genReq = new XMLHttpRequest();
        genReq.open('POST', 'http://xtacy.org:3000/_register/gen/', true);
        genReq.setRequestHeader('Content-Type', 'application/json');
        genReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash}));

        genReq.onreadystatechange = () => {
            if(genReq.readyState===4 && genReq.status===200) {
                let responseHashSequence = JSON.parse(genReq.response).rgn + config.clientKey + data.regName
                let responseHash = crypto.createHash('sha256').update(responseHashSequence).digest('hex')
                if (JSON.parse(genReq.response).hash===responseHash)
                    resolve(JSON.parse(genReq.response));
                else
                    reject('HASH_MISMATCH');
            }
        }
    });
}

exports.competeFreeRegister = (data, hash) => {
    let csrf = {
        key: localStorage.getItem(config.csrfTokenNameKey),
        token: localStorage.getItem(config.csrfTokenName + 
            localStorage.getItem(config.csrfTokenNameKey))
    };

    return new Promise((resolve,reject)=>{
        const comReq = new XMLHttpRequest();
        comReq.open('POST', 'http://xtacy.org:3000/_register/com/', true);
        comReq.setRequestHeader('Content-Type', 'application/json');
        comReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash}));

        comReq.onreadystatechange = () => {
            if(comReq.readyState===4 && comReq.status===200) {
                let responseHashSequence = JSON.parse(comReq.response).rgn + config.clientKey + data.regTeamName
                let responseHash = crypto.createHash('sha256').update(responseHashSequence).digest('hex')
                if (JSON.parse(comReq.response).hash===responseHash)
                    resolve(JSON.parse(comReq.response));
                else
                    reject('HASH_MISMATCH');
            }
        }
    });
}

//----------------------------------------------------------

exports.getEventData = (eventId) => {
    return new Promise((resolve,reject)=>{
        const eventReq = new XMLHttpRequest();
        eventReq.open('GET', 'http://xtacy.org:3000/register/_eventData/' + eventId + '/', true);
        eventReq.send();
        eventReq.onreadystatechange = () => {
            if(eventReq.readyState===4 && eventReq.status===200) {
                let eventRes = JSON.parse(eventReq.response);
                if(eventRes.validation) {
                    for (let i = 0; i < eventRes.arb; i++) 
                        eventRes.data = atob(eventRes.data)
                    eventRes.data = JSON.parse(eventRes.data)
                    resolve(eventRes);
                } else {
                    reject('CSRF_INVALID');
                }
            }
        }
    });
}