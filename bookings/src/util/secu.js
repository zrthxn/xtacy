const config = require('./config.json');

exports.validateToken = () => {
    return new Promise((resolve, reject)=>{
        const valReq = new XMLHttpRequest();
        valReq.open('POST', 'http://xtacy.org:3000/_secu/csrtoken/', true);
        valReq.setRequestHeader('Content-Type', 'application/json');

        var key = localStorage.getItem( config.csrfTokenNameKey );    
        var token = localStorage.getItem( config.csrfTokenName+key );

        if(key===null) {
            reject('CSR_TOKEN_INVALID');
        } else {
            valReq.send(JSON.stringify({ "key" : key, "token" : token }));
        }
        
        valReq.onreadystatechange = () => {
            if(valReq.readyState===4 && valReq.status===200) {
                let valRes = JSON.parse(valReq.response);
                if(valRes.validation) {
                    resolve('CSR_TOKEN_VALID');
                } else {
                    let k = localStorage.getItem( config.csrfTokenNameKey );
                    localStorage.removeItem( config.csrfTokenNameKey );
                    localStorage.removeItem( config.csrfTokenName+k );
                    reject('CSR_TOKEN_INVALID');
                }
            }
        }
    });
}

exports.generateSecurityFluff = (amount) => {
    let arr = ['_td-xhr', '__id', 'k_0-g01G', '_fl_namk-xtc'];
    for(let i=0;i<amount;i++) {
        let tag = arr[i%4];
        let fluff = "";
        let fluff_len = Math.floor(Math.random()*24);
        if(i%2===0) {
            for(let n=0;n<fluff_len;n++)
                fluff += Math.floor(Math.random()*36).toString('36')
        } else {
            for(let n=0;n<fluff_len;n++)
                fluff += Math.floor(Math.random()*10)
        }
        localStorage.setItem(tag, fluff);
    }    
}