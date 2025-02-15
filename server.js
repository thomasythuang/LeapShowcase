// server.js

// set up
var express 		= require('express');
var app 		= express(); 			// create app w/ express
var port 		= process.env.PORT || 8000; 	// set port

// express modules
var morgan 		= require('morgan');

// express config
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); 

// routes ======================================================================
app.get('/', function(req, res){
	res.sendFile('public/main.html', {root: __dirname});
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
