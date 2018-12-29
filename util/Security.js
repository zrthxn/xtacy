const database = require('./Database').database;

exports.validateCSRFTokens = (key, token) => {
    return new Promise((resolve,reject)=>{
        database.ref('csrf-tokens/' + key)
            .once('value')
            .then((csrf_token)=>{
                if (csrf_token.val() === token) {
                    console.log('CSR Key Verified', key);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err)=>{
                reject(err);
            });
    });
}

exports.validateAPIKey = (apiKey, api, user) => {
    return new Promise((resolve,reject)=>{
        database.ref('api-keys/' + apiKey)
            .once('value')
            .then((api_key)=>{
                resolve(true);;
                // if (api_key.val() === token) {
                //     console.log('CSR Key Verified', key)
                //     resolve(true)
                // } else {
                //     resolve(false)
                // }
            }).catch((err)=>{
                reject(err);
            });
    });
}