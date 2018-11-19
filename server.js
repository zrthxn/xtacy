/**
 * @author Alisamar Husain
 * Server for the fest website
 */

const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');

const PORT = process.env.PORT || 3000;
const __domain = require('config.json').domain || 'encomium.in';

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

app.use(vhost('' + __domain, homepage))
app.use(vhost('www.' +  __domain, homepage))

// =============================================================== //
// ROUTING ----------------------------------------------- ROUTING //
// =============================================================== //

homepage.get('/', (req,res)=>{
    res.render('index', { 'title' : 'HOME' });
})