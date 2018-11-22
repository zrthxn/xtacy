/**
 * @author Alisamar Husain
 * Server for the fest website
 */

const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const vhost = require('vhost');
const bodyParser = require('body-parser');

const app = express();
const homepage = express();

const PORT = process.env.PORT || 3000;
const ServerConfig = require('./config.json');
const __domain = require('./config.json').domain;

const Security = require('./util/Security');

homepage.use(bodyParser.json())
homepage.use(bodyParser.urlencoded({ extended: true }))
homepage.use(express.json())
homepage.use(express.urlencoded({ extended: true }))
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

app.use(vhost(__domain, homepage))
app.use(vhost('www.' +  __domain, homepage))
app.listen(PORT, ()=>{
    console.log('\tServer Running :: Virtual Host');
})

// homepage.listen(PORT, ()=>{
//     console.log('\tServer Running');
// })

// =============================================================== //
// ROUTING ----------------------------------------------- ROUTING //
// =============================================================== //

homepage.get('/', (req,res)=>{
    res.render('index', { 'title' : 'HOME' })
});

homepage.get('/_secu/firebase/:ckey/:mode/', (req,res)=>{
    // == GET Firebase Credentials == //
    var ckey = Buffer.from(req.params.ckey, 'base64').toString('ascii')
    if(req.params.mode==='GET' && ckey===require('./config.json').clientKey){
        res.json(ServerConfig.firebase)
    } else {
        res.send(500)
    }
});

homepage.post('/_secu/csrtoken/', (req,res)=>{
    // == CSRF Token Validation == //
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            res.json({ validation : result })
        }).catch((error)=>{
            console.error(error)
            res.send(500)
        })
});