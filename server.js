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
const ContentDelivery = require('./util/ContentDelivery');
const EventManager = require('./util/EventManager');

homepage.use(bodyParser.json())
homepage.use(bodyParser.urlencoded({ extended: true }))
homepage.use(express.json())
homepage.use(express.urlencoded({ extended: true }))
homepage.use(express.static( path.join(__dirname, 'homepage') ))
homepage.use(express.static( path.join(__dirname, 'bookings') ))

// Static Served Directories
homepage.use('/static', express.static( path.join(__dirname, 'homepage', 'static') ))

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

// homepage.post('/_register/:ckey/:mode/', (req,res)=>{
//     // Example of NON-PAGE REQUEST
//     Security.validateCSRFTokens(req.body.key, req.body.token)
//         .then((result)=>{
//             // do whatever has to be done
//             res.sendStatus(200)
//         }).catch((error)=>{
//             console.error(error)
//             res.sendStatus(500)
//         })
// });

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

homepage.post('/_contact/send/', (req,res)=>{
    let { name, email, msg } = req.body
    Security.validateCSRFTokens(req.body.csrf.key, req.body.csrf.token)
        .then((result) => {
            if (result) {
                Gmailer.SingleDelivery({
                    to: email,
                    from: 'hello@xtacy.org',
                    subject: 'Hi! Team Xtacy',
                    body: 'Contact Acknowledgement Email'
                })
            } else
                res.sendStatus(403)
        }).then(()=>{
            Gmailer.SingleDelivery({
                to: 'hello@xtacy.org', //'webParastorage@xtacy.org',
                from: 'noreply@xtacy.org',
                replyTo: email,
                subject: 'Contact Form | ' + name,
                body: `
                    <b>---------------- Contact Form Message ----------------</b> <br><br>
                    Name: ${name} <br>
                    Email: ${email} <br>
                    <br>
                    Message: ${msg}<br>
                    <br>
                    <b>------------------- End of Message -------------------</b> <br>
                    <br>
                `
            })
        }).then(()=>{
            GSheets.AppendToSpreadsheet([{
                ssId: ServerConfig.Sheets.spreadsheets.xtacy,
                sheet: 'Mailing List',
                values: [
                    email, name, 'via Contact Form'
                ]
            },{
                ssId: ServerConfig.Sheets.spreadsheets.xtacy,
                sheet: 'Contact Form',
                values: [
                    email, name, msg
                ]
            }])
        }).then(()=>{
            res.sendStatus(200)
        }).catch((error)=>{
            console.error(error)
            res.sendStatus(500)
        })
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

homepage.get('/event/:eventId/promo', (req,res)=>{
    EventManager.findEventPromoById(req.params.eventId)
        .then((result)=>{
            if (result.success) {
                res.render('eventPromoTemplate', 
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

homepage.get('/bookings/', (req,res)=>{
    res.sendFile( path.resolve(__dirname, 'bookings/build', 'book.html') )
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
// =============================================================================================

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