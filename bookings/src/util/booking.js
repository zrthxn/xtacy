exports.getEventData = (eventId) => {
    return new Promise((resolve,reject)=>{
        const eventReq = new XMLHttpRequest();
        eventReq.open('GET', 'http://xtacy.org:3000/eventData/', true);
        eventReq.setRequestHeader('Content-Type', 'application/json');
        eventReq.send(JSON.stringify({ "eventId": eventId }));

        eventReq.onreadystatechange = () => {
            if(eventReq.readyState===4 && eventReq.status===200) {
                let eventRes = JSON.parse(eventReq.response);
                if(eventRes.validation) {
                    resolve(eventRes);
                } else {
                    reject('NOT_FOUND');
                }
            }
        }
    });
}

exports.validateData = (data, schema) => {

}

exports.generalRegister = (data, csrf, hash) => {
    return new Promise((resolve,reject)=>{
        // const genReq = new XMLHttpRequest();
        // genReq.open('POST', 'http://xtacy.org:3000/register/gen/', true);
        // genReq.setRequestHeader('Content-Type', 'application/json');
        // genReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash}));

        // genReq.onreadystatechange = () => {
        //     if(genReq.readyState===4 && genReq.status===200) {
        //         resolve(JSON.parse(genReq.response));
        //     }
        // }
        resolve({ validation: true });
    });
}

exports.competitiveRegister = (data, csrf, hash) => {
    return new Promise((resolve,reject)=>{
        // const genReq = new XMLHttpRequest();
        // genReq.open('POST', 'http://xtacy.org:3000/register/com/', true);
        // genReq.setRequestHeader('Content-Type', 'application/json');
        // genReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash}));

        // genReq.onreadystatechange = () => {
        //     if(genReq.readyState===4 && genReq.status===200) {
        //         resolve(JSON.parse(genReq.response));
        //     }
        // }
        resolve({ validation: true });
    });
}