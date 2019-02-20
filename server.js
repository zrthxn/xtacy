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
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const request = require('request');
const fileUpload = require('express-fileupload');

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
const Database = require('./util/Database');
const Payments = require('./util/Payments');

homepage.use(cookieParser(ServerConfig.clientKey, {}))
homepage.use(bodyParser.json())
homepage.use(bodyParser.urlencoded({ extended: true }))
homepage.use(express.json())
homepage.use(express.urlencoded({ extended: true }))

// Static Served Directories
homepage.use('/static', express.static( path.join(__dirname, 'homepage', 'static') ))
homepage.use('/register', express.static( path.join(__dirname, 'bookings', 'build') ))
homepage.use('/register/main', express.static( path.join(__dirname, 'bookings', 'build') ))
homepage.use('/register/payment/', express.static( path.join(__dirname, 'bookings', 'build') ))
homepage.use('/register/cancel', express.static( path.join(__dirname, 'bookings', 'build') ))

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

// Content Delivery ------------------ //
cdn.use(cookieParser(ServerConfig.clientKey, {}))
cdn.use(bodyParser.json())
cdn.use(bodyParser.urlencoded({ extended: true }))
cdn.use(express.json())
cdn.use(express.urlencoded({ extended: true }))
cdn.use(fileUpload({ 
    limits: { fileSize: 50 * 1024 * 1024 },
    tempFileDir: __dirname + '/cdn/temp'
}))

// APIs ------------------------------ //
api.use(cookieParser(ServerConfig.clientKey, {}))
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({ extended: true }))
api.use(express.json())
api.use(express.urlencoded({ extended: true }))

// Virtual Host ---------------------- //
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

  // ========================================================================================= //
 // ROUTING ------------------------------------------------------------------------- ROUTING //
// ========================================================================================= //

homepage.get('/', (req,res)=>{
    res.render('index', { 'title' : 'Xtacy' })
});
homepage.get('/about', (req,res)=>{
    res.render('about', { 'title' : 'About' })
});
homepage.get('/contact', (req,res)=>{
    res.render('contact', { 'title' : 'Contact Us' })
});
homepage.get('/events', (req,res)=>{
    res.render('events', { 'title' : 'Events' })
});
homepage.get('/signup', (req,res)=>{
    res.render('register', { 'title' : 'Register' })
});
homepage.get('/sponsors', (req,res)=>{
    res.render('sponsors', { 'title' : 'Sponsors' })
});
homepage.get('/terms', (req,res)=>{
    res.render('terms', { 'title' : 'Terms' })
});
homepage.get('/reach', (req,res)=>{
    res.render('reach', { 'title' : 'How to Reach' })
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

// // --------------------------
// Remove for production build
homepage.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// // --------------------------

homepage.get('/_secu/csrtoken/', (req,res)=>{
    // == Webpage CSRF Token Generation == //
    if(req.headers.host.match(/xtacy[.]org*/i)) {
        Security.generateCSRFTokens()
            .then((result)=>{
                res.json({ key : result.key, token : result.token })
            }).catch((error)=>{
                console.error(error)
                res.sendStatus(500)
            })
    } else {
        res.status(403).send('Trying to be smart, are we?')
    }
});

homepage.post('/_secu/csrtoken/', (req,res)=>{
    // == Webpage CSRF Token Validation == //
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            if (result) {
                res.json({ status : true })
            } else {
                Security.generateCSRFTokens().then((result)=>{
                    res.json({ status : false, key : result.key, token : result.token })
                }).catch((error)=>{
                    console.error(error)
                    res.sendStatus(500)
                })
            }
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(403)
        })
});

homepage.post('/_contact/send/', (req,res)=>{
    let { formName, formEmail, formMsg } = req.body
    Security.validateCSRFTokens(req.body.srKey, req.body.srToken)
        .then((result) => {
            if (result) {
                Gmailer.SingleDelivery({
                    to: formEmail, from: 'hello@xtacy.org',
                    subject: 'Hi! Team Xtacy',
                    body: fs.readFileSync('./mail/templates/contactAcknowledgement.html')
                })
            } else
                res.sendStatus(403)
        }).then(()=>{
            Gmailer.SingleDelivery({
                to: 'webparastorage@xtacy.org', from: 'noreply@xtacy.org',
                replyTo: formEmail, subject: 'Contact Form | ' + formName,
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

homepage.post('/_register/:type/', (req,res)=>{
    let hashSequence = JSON.stringify(req.body.data)
    let hmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(hashSequence).digest('hex')

    Security.validateCSRFTokens(req.body.csrf.key, req.body.csrf.token)
        .then((csrfRes)=>{
            if (csrfRes) {
                if ( req.body.checksum === hmac ) {
                    let { data, txn } = req.body
                    if(req.params.type==='gen') {
                        EventManager.generalRegister(data).then((rgn) => registrationSuccessful(rgn) )
                    } else if(req.params.type==='com') {
                        EventManager.competeRegister(data, txn).then((rgn) => registrationSuccessful(rgn) )
                    } else if(req.params.type==='tic') {
                        EventManager.ticketRegister(data, txn).then((rgn) => registrationSuccessful(rgn) )
                    } else {
                        res.json({ validation: false })
                    }

                    function registrationSuccessful(rgn) {
                        let responseHashSequence = JSON.stringify({ validation: true, rgn: rgn })
                        let responseHmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(responseHashSequence).digest('hex')
                        res.json({ validation: true, rgn: rgn, hash: responseHmac })
                    }
                } else 
                    throw "HASH_INVALID"
            } else 
                throw "CSRF_INVALID"
        }).catch((err)=>{
            console.log('FAILED VALIDATION :: ' + err)
            res.json({ validation: false })
        })
});

homepage.post('/_payment/create/', (req,res)=>{
    Security.validateCSRFTokens(req.body.csrf.key, req.body.csrf.token)
        .then((csrfRes)=>{
            if(csrfRes) {
                let hashSequence = JSON.stringify(req.body.data)
                let hmac = crypto.createHmac('sha256', ServerConfig.clientKey).update(hashSequence).digest('hex')
                if ( req.body.checksum === hmac ) {
                    Payments.CreateNewPayment({
                        amount: req.body.data.amount,
                        payer: req.body.data.payer,
                        eventData: req.body.data.eventData
                    }).then((payment)=>{
                        if(payment.success) 
                            res.json(payment)
                    }).catch((err)=>{
                        console.log(err)
                        res.status(500).send(err)
                    })
                } else 
                    throw "HASH_INVALID"
            } else
                throw "CSRF_INVALID"
        }).catch((err)=>{
            res.status(403).send(err)
        })
});

homepage.post('/_payment/webhook/', (req,res)=>{
    let webhookData = req.body
    if(webhookData !== null) {
        Database.firestore.collection('transactions').where('paymentRequestId', '==', webhookData.payment_request_id).get()
        .then((snapshot) => {
            let { txnId } = snapshot[0].data()
            Database.firestore.collection('transactions').doc(txnId).update({
                'paymentId' : webhookData.payment_id,
                'status': webhookData.status,
            })
            res.send(200)
        })
    } else {
        res.send(324)
    }
});

// CONTENT DELIVERY NETWORK --------------------------------------- CDN
// ====================================================================

cdn.get('/', (req,res)=>{
    let _token = 'LOGIN_NOT_VALIDATED'
    if(req.cookies['_x-key']!==undefined)
        _token = crypto.createHmac('sha512', ServerConfig.clientKey).update(req.cookies['_x-key']).digest('hex')
    else res.sendFile( path.resolve(__dirname, 'cdn', 'index.html') )

    Database.database.ref('cdn_login/' + req.cookies['_x-key']).once('value', (snap)=>{
        if(((new Date(Date.now())) - snap.val().valTime) < 300000) {
            if(req.cookies['_x-cdn']===_token)
                res.sendFile( path.resolve(__dirname, 'cdn', 'cdn.html') )
            else throw 'LOGIN_NOT_VALIDATED'
        } else
            res.sendFile( path.resolve(__dirname, 'cdn', 'index.html') )
    }).catch(()=>{
        res.sendFile( path.resolve(__dirname, 'cdn', 'index.html') )
    })
});

cdn.get('/login', (req,res)=>{
    res.sendFile( path.resolve(__dirname, 'cdn', 'login.html') )
});

cdn.post('/login', (req,res)=>{
    // Login Authorzation
    let { password } = req.body
    if(password === 'ohmygodthextacy') {
        let key = 'xcdn'
        for(let i=0; i<12; i++)
            key += Math.floor( Math.random() * 16 ).toString(16)
        let token = crypto.createHmac('sha512', ServerConfig.clientKey).update(key).digest('hex')
        res.cookie( '_x-key', key, { expires: new Date(Date.now() + 300000) } )
        res.cookie( '_x-cdn', token, { expires: new Date(Date.now() + 300000) } )
        Database.database.ref('cdn_login/' + key).set({
            "key": key,
            "token": token,
            "valTime": (new Date(Date.now()))
        })
        res.redirect('/')
    } else {
        res.send(403)
    }
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

cdn.get('/d/:fileRef/', (req,res)=>{
    ContentDelivery.Lookup(req.params.fileRef)
        .then(({ filepath, filename, originalName, contentType })=>{
            res.type(contentType)
            res.sendFile( path.join(__dirname, 'cdn', filepath, filename) )
        }).catch((result, err)=>{
            console.error(result, err)
            res.sendStatus(500)
        })
});

cdn.post('/_upload/', (req,res)=>{
    ContentDelivery.Upload(req.files.fileupload, req.body.filepath, {})
        .then((fileRef)=>{
            res.json({ ref: fileRef })
        }).catch((err)=>{
            res.status(403).send(err)
        })
});

// APIs ---------------------------------------------------------- APIs
// ====================================================================

api.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

api.post('/_sheets/:function/', (req,res)=>{
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

api.post('/_mail/:function/', (req,res)=>{
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

api.post('/_barcode/:function/', (req,res)=>{
    // == Barcode Reader == //
    // Security.validateAPIKey()
    switch(req.params.function) {
        case 'read':
            let { readCode } = req.body
            Database.firestore.collection('registrations').doc(readCode).get()
            .then((reg)=>{
                res.json(reg.data())
            })
            break
        default:
            break
    }
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
        
        case 'barcode':
            let testObj = Database.firestore
            if(testObj!==undefined) res.send('Barcode : Test Successful')
            else res.send('Internal Error')
            break

        default:
            res.sendStatus(404)
    }
});