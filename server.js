/**
 * @author Alisamar Husain
 * Server for the fest website
 */

const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const vhost = require('vhost');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
const ServerConfig = require('./config.json');
const __domain = require('./config.json').domain;

const firebase = require('./util/Database').firebase;

const app = express();
const homepage = express();

homepage.use( express.static( path.join(__dirname, 'homepage') ) )
homepage.set('views', path.join(__dirname, 'homepage'))
homepage.set('view engine', 'hbs')
homepage.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '\\homepage\\layouts',
    partialsDir: [
        __dirname + '\\homepage\\partials'
    ]
}))

homepage.use(bodyParser.json())
homepage.use(bodyParser.urlencoded({ extended: true }))
homepage.use(express.json())
homepage.use(express.urlencoded({ extended: true }))

app.use(vhost(__domain, homepage))
app.use(vhost('www.' +  __domain, homepage))
app.listen(PORT, ()=>{
    console.log('\tServer Running');
})

// =============================================================== //
// ROUTING ----------------------------------------------- ROUTING //
// =============================================================== //

homepage.get('/', (req,res)=>{
    res.render('index', { 'title' : 'HOME' });
})

// == GET Firebase Credentials == //
homepage.get('/_secu/firebase/:mode/', (req,res)=>{
    if(req.params.mode==='GET'){
        res.json(ServerConfig.firebase);
    }
})

// == CSRF Token Validation == //
homepage.post('/_secu/csrtoken/', (req,res)=>{
    var key = req.body.key, token = req.body.token;
    // firestore.collection('csrf-tokens').where('key', '==', key)
    //     .get()
    //     .then((query)=>{
    //             query.forEach((doc)=>{
    //                 // if (result.data().token===token && result[0].id===key)
    //                     res.json({ 'validation' : true });
    //                 // else
    //                 //     res.json({ 'validation' : false });
    //                 console.log(doc.id, " => ", doc.data());
    //             });
    //     }).catch((e)=>{
    //         console.log(e);
    //     })

    firebase.database().ref('csrf-tokens/'+key)
        .once('value', (csrf_token)=>{
            if (csrf_token.val()===token)
                res.json({ 'validation' : true });
            else res.json({ 'validation' : false });
        })
});