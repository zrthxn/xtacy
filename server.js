const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const homepage = express();

const PORT = process.env.PORT || 3000;

homepage.use( express.static(path.join(__dirname, 'homepage')) );
homepage.get('/', (req, res)=>{
    res.sendFile( path.resolve(__dirname, 'homepage', 'index.html') );
});

homepage.listen(PORT, ()=>{
    console.log("SERVER :: Initialized :: Listening on PORT : ", PORT);
});