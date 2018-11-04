/**
 * @author Alisamar Husain
 * Server for the fest website
 */

const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const homepage = express();

const PORT = process.env.PORT || 3000;

// =====================================

homepage.use( express.static(path.join(__dirname, 'homepage')) );
homepage.set('views', path.join(__dirname, 'homepage'));
homepage.set('view engine', 'hbs');
homepage.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/homepage/layouts',
    partialsDir  : [
        __dirname + '/homepage/partials',
    ]
}));

homepage.listen(PORT, ()=>{
    console.log("SERVER :: Initialized :: Listening on PORT : ", PORT);
});

// ROUTER ===========================

homepage.get('/', (req, res)=>{
    res.render('index', { title: 'Home' });
});