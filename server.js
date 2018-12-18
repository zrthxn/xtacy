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

const app = express();
const homepage = express();

const PORT = process.env.PORT || 3000;
const ServerConfig = require('./config.json');
const __domain = require('./config.json').domain;

const Security = require('./util/Security');
const Gmailer = require('./util/Gmailer');

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

homepage.post('/_register/:ckey/:mode/', (req,res)=>{
    // Example of NON-PAGE REQUEST
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            // do whatever has to be done
            res.send(200)
        }).catch((error)=>{
            console.error(error)
            res.send(500)
        })
});

homepage.get('/_file/GET/:type/:path/:filename/', (req,res)=>{
    // FILE DELIVERY NETWORK
    let __path = Buffer.from(req.params.path, 'base64').toString('ascii');
    if(req.params.type==='preset' && __path==='root') {
        switch(req.params.filename) {
            case 'favicon':
                res.sendFile( path.resolve(__dirname, 'homepage/static/img', 'favicon.png') )
                break;
            default:
                res.send(404)
        }
    } else {
        res.send(500)
    }
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
    // == Webpage CSRF Token Validation == //
    Security.validateCSRFTokens(req.body.key, req.body.token)
        .then((result)=>{
            res.json({ validation : result })
        }).catch((error)=>{
            console.error(error)
            res.send(500)
        })
});

// homepage.post('/_smtp/send/', (req,res)=>{
//     Security.validateCSRFTokens(req.body.key, req.body.token)
//         .then((result)=>{
//             res.json({ validation : result })
//         }).catch((error)=>{
//             console.error(error)
//             res.send(500)
//         })
// });

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