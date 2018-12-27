/**
 * @author Alisamar Husain
 * Server for the fest website
 */

const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const vhost = require('vhost');
const bodyParser = require('body-parser');

const xtacy = express();
const homepage = express();
const cdn = express();
const api = express();

const PORT = process.env.PORT || 3000;
const ServerConfig = require('./config.json');
const __domain = require('./config.json').domain;

const Security = require('./util/Security');
const Gmailer = require('./util/Gmailer');
const GSheets = require('./util/GSheets');
const ConsoleScreen = require('./util/ConsoleScreen');

homepage.use(bodyParser.json())
homepage.use(bodyParser.urlencoded({ extended: true }))
homepage.use(express.json())
homepage.use(express.urlencoded({ extended: true }))
homepage.use(express.static( path.join(__dirname, 'homepage') ))
homepage.set('views', path.join(__dirname, 'homepage'))
homepage.set('view engine', 'hbs')
homepage.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/homepage/layouts',
    partialsDir: [
        __dirname + '/homepage/partials'
    ]
}))

// ----------- File Delivery ----------
cdn.use(bodyParser.json())
cdn.use(bodyParser.urlencoded({ extended: true }))
cdn.use(express.json())
cdn.use(express.urlencoded({ extended: true }))
cdn.use(express.static( path.join(__dirname, 'cdn') ))

// ----------- APIs ----------
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

// ----------- Virtual Host ----------
xtacy.use(vhost(__domain, homepage))
xtacy.use(vhost('www.' +  __domain, homepage))
xtacy.use(vhost('cdn.' +  __domain, cdn))
xtacy.use(vhost('api.' +  __domain, api))

xtacy.listen(PORT, ()=>{
    ConsoleScreen.StartupScreen({
        "PORT" : PORT,
        "ServerState" : ServerConfig.ServerState
    })
})

// =============================================================== //
// ROUTING ----------------------------------------------- ROUTING //
// =============================================================== //

homepage.get('/', (req,res)=>{
    res.render('index', { 'title' : 'HOME' })
});
homepage.get('/about', (req,res)=>{
    res.render('about', { 'title' : 'ABOUT' })
});
homepage.get('/contact', (req,res)=>{
    res.render('contact', { 'title' : 'CONTACT' })
});
homepage.get('/events', (req,res)=>{
    res.render('events', { 'title' : 'EVENTS' })
});
homepage.get('/register', (req,res)=>{
    res.render('register', { 'title' : 'REGISTER' })
});
homepage.get('/terms', (req,res)=>{
    res.render('terms', { 'title' : 'TERMS' })
});

homepage.get('/event/:eventId/', (req,res)=>{
    res.render('events', { 'title' : 'EVENTS' })
});

homepage.post('/_register/:ckey/:mode/', (req,res)=>{
    // Example of NON-PAGE REQUEST
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            // do whatever has to be done
            res.sendStatus(200)
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(500)
        })
});

homepage.get('/_secu/firebase/:ckey/:mode/', (req,res)=>{
    // == GET Firebase Credentials == //
    var ckey = Buffer.from(req.params.ckey, 'base64').toString('ascii')
    if(req.params.mode==='GET' && ckey===require('./config.json').clientKey){
        res.json(ServerConfig.firebase)
    } else {
        res.sendStatus(500)
    }
});

homepage.post('/_secu/csrtoken/', (req,res)=>{
    // == Webpage CSRF Token Validation == //
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            res.json({ validation : result })
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(500)
        })
});

// ===============================

// FILE DELIVERY
cdn.get('/GET/preset/:filename/', (req,res)=>{
    switch(req.params.filename) {
        case 'faviconpng':
            res.sendFile( path.resolve(__dirname, 'cdn/presets', 'favicon.png') )
            break
        case 'faviconico':
            res.sendFile( path.resolve(__dirname, 'cdn/presets', 'favicon.ico') )
            break
        default:
            res.sendStatus(404)
    }
});

cdn.get('/GET/file/:path/:filename/', (req,res)=>{
    let __path = Buffer.from(req.params.path, 'base64').toString('ascii');
    if (__path=='root') __path = ''
    res.sendFile( path.resolve(__dirname, 'cdn', __path, decodeURI(req.params.filename)) )
});

// ===============================

api.post('/_:api/:function/:data/', (req,res)=>{
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            res.json({ validation : result })
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(500)
        })
});

api.get('/_:api/test/', (req,res)=>{
    switch(req.params.api) {
        case 'sheets':
            GSheets.TestGSheets()
                .then((result)=>{
                    if (result.success) res.send('GSheets : Test Successful')
                    else res.send('GSheets : Test Failed')
                })
                .catch(()=>{
                    res.send('Internal Error')
                })
            break

        case 'mail':
            Gmailer.TestGmailer()
                .then((result)=>{
                    if (result.success) res.send('Gmailer : Test Successful')
                    else res.send('Gmailer : Test Failed')
                })
                .catch(()=>{
                    res.send('Internal Error')
                })
            break

        default:
            res.sendStatus(404)
    }
});
// ===============================

function EXAMPLE_EMAIL_SENDING() {
    var mail = {
        to:"", //just email
        from:"alisamar181099@gmail.com", // just email
        username:"Alisamar Husain", // name on Account "Alisamar Husain",
        userId: "alisamar181099@gmail.com", // Just email
        subject:"",
        body:"" // raw non-base64 html text body
    };
    
    fs.readFile('email.txt', (err,content)=>{
        if (err) return console.log(err);
    
        fs.readFile('data.csv', (e,db)=>{
            if (e) return console.log(e);
            // Gmailer.DatasetDelivery({
            //     to:"", //just email
            //     from:"alisamar181099@gmail.com", // just email
            //     username:"Alisamar Husain", // name on Account "Alisamar Husain",
            //     userId: "alisamar181099@gmail.com", // Just email
            //     subject:"",
            //     body: "" // raw non-base64 html text body
            // }, content.toString().trim(), db.toString().trim(), {}).then(()=>{
            //     console.log('DONE');
            // });
            Gmailer.DistributedCampaign({
                to:"", //just email
                from:"alisamar181099@gmail.com", // just email
                username:"Alisamar Husain", // name on Account "Alisamar Husain",
                userId: "alisamar181099@gmail.com", // Just email
                subject:"",
                body: "" // raw non-base64 html text body
            }, content.toString().trim(), db.toString().trim(), {});
        });
    
        // Gmailer.SingleDelivery({
        //     to:"zrthxn@gmail.com", //just email
        //     from:"alisamar181099@gmail.com", // just email
        //     username:"Alisamar Husain", // name on Account "Alisamar Husain",
        //     userId: "alisamar181099@gmail.com", // Just email
        //     subject:"Single Email",
        //     body: content.toString().trim() // raw non-base64 html text body
        // }).then(()=>{
        //     console.log('DONE');
        // }); 
    });
}