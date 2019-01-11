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
const crypto = require('crypto');

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
const ContentDelivery = require('./util/ContentDelivery');
const EventManager = require('./util/EventManager');

homepage.use(bodyParser.json())
homepage.use(bodyParser.urlencoded({ extended: true }))
homepage.use(express.json())
homepage.use(express.urlencoded({ extended: true }))
homepage.use(express.static( path.join(__dirname, 'homepage') ))

// Static Served Directories
homepage.use('/static', express.static( path.join(__dirname, 'homepage', 'static') ))
homepage.use('/book/start', express.static( path.join(__dirname, 'bookings', 'build') ))

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
cdn.use(express.static( path.join(__dirname, 'cdn', 'root') ))

// ----------- APIs ----------
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

// ----------- Virtual Host ----------
xtacy.use(vhost(__domain, homepage))
xtacy.use(vhost('www.' +  __domain, homepage))
xtacy.use(vhost('cdn.' +  __domain, cdn))
// xtacy.use(vhost('api.' +  __domain, api))

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
    EventManager.findEventById(req.params.eventId)
        .then((result)=>{
            if (result.success) {
                res.render('eventTemplate', 
                    {
                        'title' : result.title,
                        'page' : {
                            'data' : JSON.stringify(result.data),
                            'content' : result.content
                        }
                    }
                )
            } else {
                res.render('404', { 'title' : 'Not Found' })
            }
        }).catch(()=>{
            res.redirect('/events')
        })
});

homepage.get('/event/:eventId/promo/', (req,res)=>{
    EventManager.findEventPromoById(req.params.eventId)
        .then((result)=>{
            if (result.success)
                res.render('eventPromoTemplate', {
                    'title' : result.title,
                    'page' : {
                        'data' : JSON.stringify(result.data),
                        'content' : result.content
                    }
                })
            else
                res.render('404', { 'title' : 'Not Found' })
        }).catch(()=>{
            res.redirect('/events')
        })
});

//--------------------------
// Remove for production build
homepage.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//--------------------------

homepage.get('/_secu/firebase/:ckey/:mode/', (req,res)=>{
    // == GET Firebase Credentials == //
    var ckey = Buffer.from(req.params.ckey, 'base64').toString('ascii')
    if(req.params.mode==='GET' && ckey===require('./config.json').clientKey){
        res.json({ config: ServerConfig.firebase, apiKey: ServerConfig.firebaseClientAPIKey})
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

homepage.post('/_contact/send/', (req,res)=>{
    let { formName, formEmail, formMsg } = req.body
    Security.validateCSRFTokens(req.body.srKey, req.body.srToken)
        .then((result) => {
            if (result) {
                Gmailer.SingleDelivery({
                    to: formEmail,
                    from: 'hello@xtacy.org',
                    subject: 'Hi! Team Xtacy',
                    body: 'Contact Acknowledgement Email'
                })
            } else
                res.sendStatus(403)
        }).then(()=>{
            Gmailer.SingleDelivery({
                to: 'webparastorage@xtacy.org',
                from: 'noreply@xtacy.org',
                replyTo: formEmail,
                subject: 'Contact Form | ' + formName,
                body: `
                    <b>---------------- Contact Form Message ----------------</b> <br><br>
                     Name: ${formName} <br> Email: ${formEmail}<br><br>
                     Message: ${formMsg}<br><br>
                    <b>------------------- End of Message -------------------</b> <br><br>
                `
            })
        }).then(()=>{
            GSheets.AppendToSpreadsheet([{
                ssId: ServerConfig.Sheets.spreadsheets.repository,
                sheet: 'Mailing List',
                values: [
                    formEmail, formName, 'via Contact Form'
                ]
            },{
                ssId: ServerConfig.Sheets.spreadsheets.repository,
                sheet: 'Contact Form',
                values: [
                    formEmail, formName, formMsg
                ]
            }])
        }).then(()=>{
            res.render('contactAcknowledge', { 'title' : 'THANK YOU' })
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(500)
        })
});

homepage.post('/register/_checksum/', (req,res)=>{
    let { type, id } = JSON.parse(Buffer.from(req.body.data, 'base64').toString('ascii'))
    let hashSequence = type + ServerConfig.clientKey + id
    let hash = crypto.createHash('sha256').update(hashSequence).digest('hex')
    console.log('Event Hash Created', hash)
    res.json({ checksum: hash })
});

homepage.get('/register/_eventData/:eventId/', (req,res)=>{
    EventManager.getEventData(req.params.eventId)
        .then((data)=>{
            data = JSON.stringify(data)
            let arb = Math.floor(Math.random()*10) + 1
            for (let i = 1; i <= arb; i++) 
                data = Buffer.from(data, 'ascii').toString('base64')
            
            if (data!==null) res.json({ validation: true, found: true, data: data, arb: arb })
            else res.json({ validation: true, found: false })
        }).catch((err)=>{
            console.log('FAILED VALIDATION :: ' + err)
            res.json({ validation: false })
        })
});

homepage.post('/_register/gen/', (req,res)=>{
    let hashSequence = JSON.stringify(req.body.data)
    let hmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(hashSequence).digest('hex')
    Security.validateCSRFTokens(req.body.csrf.key, req.body.csrf.token)
        .then((csrfRes)=>{
            if (csrfRes) {
                if ( req.body.checksum === hmac ) {
                    EventManager.generalRegister(req.body.data).then((rgn)=>{
                        let responseHashSequence = JSON.stringify({ validation: true, rgn: rgn })
                        let responseHmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(responseHashSequence).digest('hex')
                        res.json({ validation: true, rgn: rgn, hash: responseHmac })
                    })
                } else {
                    throw "HASH_INVALID"
                }
            } else {
                throw "CSRF_INVALID"
            }
        }).catch((err)=>{
            console.log('FAILED VALIDATION :: ' + err)
            res.json({ validation: false })
        })
});

homepage.post('/_register/com/', (req,res)=>{
    let hashSequence = JSON.stringify(req.body.data)
    let hmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(hashSequence).digest('hex')
    Security.validateCSRFTokens(req.body.csrf.key, req.body.csrf.token)
        .then((csrfRes)=>{
            if (csrfRes) {
                if ( req.body.checksum === hmac ) {
                    EventManager.competeFreeRegister(req.body.data).then((rgn)=>{
                        let responseHashSequence = JSON.stringify({ validation: true, rgn: rgn })
                        let responseHmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(responseHashSequence).digest('hex')
                        res.json({ validation: true, rgn: rgn, hash: responseHmac })
                    })
                } else {
                    throw "HASH_INVALID"
                }
            } else {
                throw "CSRF_INVALID"
            }
        }).catch((err)=>{
            console.log('FAILED VALIDATION ::', err)
            res.json({ validation: false })
        })
});

homepage.post('/_register/tic/', (req,res)=>{
    
});

// =============================================================================================

// FILE DELIVERY
cdn.get('/', (req,res)=>{
    res.sendFile( path.resolve(__dirname, 'cdn', 'index.html') )
});

cdn.get('/p/:file/', (req,res)=>{
    if (req.params.file=='cdnLookup.json') res.sendStatus(403)
    switch(req.params.file) {
        case 'faviconpng':
            res.type('image/png')
            res.sendFile( path.resolve(__dirname, 'cdn/presets', 'favicon.png') )
            break
        case 'faviconico':
            res.type('image/x-icon')
            res.sendFile( path.resolve(__dirname, 'cdn/presets', 'favicon.ico') )
            break
        default:
            res.sendStatus(404)
    }
});

cdn.get('/d/:fileId/', (req,res)=>{
    // if (req.params.fileId=='cdnLookup.json') res.sendStatus(403)
    ContentDelivery.Lookup(req.params.fileId)
        .then((path, filename, contentType)=>{
            res.type(contentType)
            res.sendFile( path.resolve(__dirname, 'cdn', path, filename) )
        }).catch((result, err)=>{
            console.error(result, err)
            res.sendStatus(500)
        })
});

cdn.put('/u/:path/:filename/', (req,res)=>{
    if (req.params.filename=='cdnLookup.json') res.sendStatus(403)
    let __path = Buffer.from(req.params.path, 'base64').toString('ascii')
    // Upload file
});

// =============================================================================================

api.post('/_sheets/:function/:options/', (req,res)=>{
    // == GSheets API == //
    Security.validateAPIKey(req.body.key, req.body.token)
        .then((result)=>{
            // Add 
            res.json({ validation : result })
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(500)
        })
});

api.post('/_mail/:function/:options/', (req,res)=>{
    // == Gmailer API == //
    Security.validateAPIKey(req.body.key, req.body.token)
        .then((result)=>{
            // Job
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
                }).catch(()=>{
                    res.send('Internal Error')
                })
            break
            
        case 'mail':
            Gmailer.TestGmailer()
                .then((result)=>{
                    if (result.success) res.send('Gmailer : Test Successful')
                    else res.send('Gmailer : Test Failed')
                }).catch(()=>{
                    res.send('Internal Error')
                })
            break

        default:
            res.sendStatus(404)
    }
});