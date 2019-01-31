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
        genReq.open('POST', 'https://xtacy.org/_register/gen/', true);
        genReq.setRequestHeader('Content-Type', 'application/json');
        genReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash }));

        genReq.onreadystatechange = () => {
            if(genReq.readyState===4 && genReq.status===200) {
                let genRes = JSON.parse(genReq.response);
                let responseHashSequence = JSON.stringify({ validation: genRes.validation, rgn: genRes.rgn })
                let responseHmac = crypto.createHmac('sha256', config.clientKey).update(responseHashSequence).digest('hex')
                if (genRes.hash===responseHmac)
                    resolve(genRes);
                else
                    reject('HASH_MISMATCH');
            }
        }
    });
}

exports.competeRegister = (data, hash) => {
    let csrf = {
        key: localStorage.getItem(config.csrfTokenNameKey),
        token: localStorage.getItem(config.csrfTokenName + 
            localStorage.getItem(config.csrfTokenNameKey))
    };

    return new Promise((resolve,reject)=>{
        const comReq = new XMLHttpRequest();
        comReq.open('POST', 'https://xtacy.org/_register/com/', true);
        comReq.setRequestHeader('Content-Type', 'application/json');
        comReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash }));

        comReq.onreadystatechange = () => {
            if(comReq.readyState===4 && comReq.status===200) {
                let comRes = JSON.parse(comReq.response);
                let responseHashSequence = JSON.stringify({ validation: comRes.validation, rgn: comRes.rgn })
                let responseHmac = crypto.createHmac('sha256', config.clientKey).update(responseHashSequence).digest('hex')
                if (comRes.hash===responseHmac)
                    resolve(comRes);
                else
                    reject('HASH_MISMATCH');
            }
        }
    });
}

exports.ticketRegister = (data, hash) => {
    let csrf = {
        key: localStorage.getItem(config.csrfTokenNameKey),
        token: localStorage.getItem(config.csrfTokenName + 
            localStorage.getItem(config.csrfTokenNameKey))
    };

    return new Promise((resolve,reject)=>{
        const ticReq = new XMLHttpRequest();
        ticReq.open('POST', 'https://xtacy.org/_register/tic/', true);
        ticReq.setRequestHeader('Content-Type', 'application/json');
        ticReq.send(JSON.stringify({ "data": data, "csrf": csrf, "checksum": hash }));

        ticReq.onreadystatechange = () => {
            if(ticReq.readyState===4 && ticReq.status===200) {
                let ticRes = JSON.parse(ticReq.response);
                let responseHashSequence = JSON.stringify({ validation: ticRes.validation, rgn: ticRes.rgn })
                let responseHmac = crypto.createHmac('sha256', config.clientKey).update(responseHashSequence).digest('hex')
                if (ticRes.hash===responseHmac)
                    resolve(ticRes);
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
        eventReq.open('GET', 'https://xtacy.org/register/_eventData/' + eventId + '/', true);
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

exports.calcTaxInclAmount = (amt) => {
    /**
     * Calculates the net amout to be paid 
     * such that the amount recieved after deductions is
     * equal to the fee of the event
    */
    // Flat transaction fee in Rupees
    const flatFee = 3

    // Transaction fee in percent
    const txnFeePct = 2.5
    
    // Applicable TAX in percent
    // Note: TAX is applied on the transaction fee only
    const taxPct = 18
    
    return (
        parseFloat(
            (amt + flatFee) / 
            (1 - txnFeePct/100 - ((taxPct/100) * (txnFeePct/100)))            
        ).toFixed(2)
    )
}