function validateToken() {
    var key = localStorage.getItem( config.csrfTokenNameKey );    
    var token = localStorage.getItem( config.csrfTokenName+key );
    if(key===null) {
        key = generateTokenKey(12);
        token = generateToken(128);
        localStorage.setItem(config.csrfTokenNameKey, key);
        localStorage.setItem(config.csrfTokenName+key, token);
        initializeClientFirebase().then(()=>{
            firebase.database().ref('csrf-tokens/' + key)
                .set(token);
        });
    }

    return new Promise((resolve, reject)=>{
        //validation from server
        const valReq = new XMLHttpRequest();
        valReq.open('POST', 'http://xtacy.org:3000/_secu/csrtoken/', true);
        valReq.setRequestHeader('Content-Type', 'application/json');
        valReq.send(JSON.stringify({ "key" : key, "token" : token }));
        valReq.onreadystatechange = () => {
            if(valReq.readyState===4 && valReq.status===200) {
                let valRes = JSON.parse(valReq.response);
                if(valRes.validation) {
                    resolve('CSR_TOKEN_VALID');
                } else {
                    localStorage.removeItem( config.csrfTokenNameKey );
                    reject('CSR_TOKEN_INVALID');
                }
            }
        }
    })
}

function generateToken(len) {
    var k = "";
    for(let i=0;i<len;i++)
        k += Math.floor(Math.random()*36).toString('36');
    return k;
}

function generateTokenKey(len) {
    var k = "";
    for(let i=0;i<len;i++)
        k += Math.floor(Math.random()*16).toString('16');
    return k;
}

function generateSecurityFluff(amount) {
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