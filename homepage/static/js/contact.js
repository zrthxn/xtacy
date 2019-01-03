function contactRequest(req) {
    const contReq = new XMLHttpRequest();
    contReq.open('POST', 'http://xtacy.org:3000/_contact/send/', true);
    contReq.setRequestHeader('Content-Type', 'application/json');
    contReq.send(JSON.stringify({
        "csrf": {
            "key": localStorage.getItem( config.csrfTokenNameKey ),
            "token": localStorage.getItem( config.csrfTokenName+localStorage.getItem( config.csrfTokenNameKey ) )
        },
        "name": req.name,
        "email": req.email,
        "msg": req.msg
    }));

    contReq.onreadystatechange = () => {
        if(contReq.readyState===4 && contReq.status===200) {
            alert('Message Sent');
        }
    }
}