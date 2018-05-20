// server.js
// where your node app starts

// init project
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Gun = require('gun');
// Must be added after Gun but before instantiating Gun
require('gun-mongo');

var helmet = require('helmet');

require('dotenv').config();
var PORT = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(helmet());
app.use(helmet.noCache());

//https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    //deal with img-src access and other for dev builds.
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(Gun.serve);
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db

//var dbFile = './.data/sqlite.db';
//var dbFile = process.env.DatabaseFile;// './.data/data.json';
//console.log("database path:", process.env.DatabaseFile);
//var exists = fs.existsSync(dbFile);
// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
//if(!exists){
  //console.log("file not exist!");
//}else{
  //console.log("file exist!");
//}

//https://cdn.glitch.com/94ca57e3-7116-4770-8a69-e0034c332f65%2Felement-icons.ttf?1525640363315
//https://cdn.glitch.com/94ca57e3-7116-4770-8a69-e0034c332f65%2Felement-icons.woff?1525640368138
//assets redirect
app.get("/fonts/element-icons.woff", function (request, response) {
  response.redirect("https://cdn.glitch.com/94ca57e3-7116-4770-8a69-e0034c332f65%2Felement-icons.woff?1525640368138");
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  response.render('index');
});

// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  //http://localhost:3000/
  //console.log(listener.address());
});
var bdatabase = false;

var gunconfig = {
  web:listener//server express
}

if(bdatabase){
  gunconfig.localStorage = false;
  gunconfig.radisk = false;

  gunconfig.mongo = {
    host: 'localhost',
    port: '27017',
    database: 'gun',
    collection: 'gun-mongo',
    query: ''
  }
}

//var gun = Gun({
  //file: dbFile,
  //web:listener//server express
//});
var gun = Gun(gunconfig);

gun.on('hi', peer => {//peer connect
  //console.log('connect peer to',peer);
  console.log('peer connect!');
});

gun.on('bye', (peer)=>{// peer disconnect
  //console.log('disconnected from', peer);
  console.log('disconnected from peer!');
});


