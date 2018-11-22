function initializeClientFirebase(clientKey) {
    const credsReq = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        credsReq.open('GET', 'http://xtacy.org:3000/_secu/firebase/' + btoa(clientKey).replace(/=/g,'') + '/GET/', true);
        credsReq.send();
        credsReq.onreadystatechange = () => {
            if(credsReq.readyState===4 && credsReq.status===200) {
                let credentials = JSON.parse(credsReq.response);
                if (firebase.apps.length===0)
                    firebase.initializeApp(credentials);
                resolve();
            }
        }
    });
}