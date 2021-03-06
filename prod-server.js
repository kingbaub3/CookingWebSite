const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const routerManager = require('./server/api/route-manager');
const helmet = require('helmet');

const app = express();

// Express configuration (order matters)
app.set('port', (process.env.PORT || 4200));
const dbUrl = process.env.MYCOOKBOOK_DB;

// Adding HSTS, removes the X-Powered-By header and sets the X-Frame-Options header to prevent click jacking, among other things.
app.use(helmet()); // All https is done through nginx.

// Needed in order to read the body of the requests.
// Allowing bodies of up to 10mb. (for image upload)
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));


// To allow letsencrypt to renew the https certificate.
app.use('/.well-known', function(request, response, next) {
  response.sendFile(request.url, {root: __dirname + '/server/.well-known'});
});
// To allow google search engine to identify the website.
app.use('/google*', function(request, response, next) {
  console.log("Google verification: ");
  console.log(request.originalUrl);
  response.sendFile(request.originalUrl, {root: __dirname + '/server'});
});

// Directory routes to hide the structure of the project.
app.use(express.static(__dirname + '/server/dist'));
app.use(express.static(__dirname + '/server'));
// Enabling CORS as we want to communicate with the server.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  next();
});


// Using the connection pool provided by the MongoClient driver to manage database connections.
// To make sure that we have it set up before we render the website, we are setting it in the
// promise of the connection pool.
mongoClient.connect(dbUrl, function(err, database) {
    if(err) throw err;

    app.listen(app.get('port'), function() {
      console.log('Server and API are running on port', app.get('port'));
    });

    // Routing all of the database query to the api folder.
    app.use('/api', routerManager(express, database));

    // Always send the index.html file. Angular's routing is handling the diffe$
    // url. That way, the page reload works when done with the browser.
    app.get('/*', function(request, response, next) {
      response.sendFile('index.html', {root: __dirname + '/server/dist'});
    });

});

