function initializeClientFirebase() {
    const credsReq = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        credsReq.open('GET', 'http://xtacy.org:3000/_secu/firebase/GET/', true);
        credsReq.send();
        credsReq.onreadystatechange = () => {
            if(credsReq.readyState===4 && credsReq.status===200) {
                let credentials = JSON.parse(credsReq.response);
                firebase.initializeApp(credentials);
                resolve();
            }
        }
    });
}