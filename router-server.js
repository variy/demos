var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlFn =  require('url');

var CONFIG = require('./config.js');
var routerPath = CONFIG.routerPath;
var PORT = CONFIG.reqd === 'local' ? urlFn.parse(CONFIG.requestDomain).port : CONFIG.port;
if( CONFIG.reqd === 'local'){
    var cors = require('cors');
    app.use(cors({
        origin: 'http://localhost:' + CONFIG.port,
        methods: ['GET', 'PUT', 'POST']
    }));
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

var router = require(path.join(routerPath, 'router.js'))(express, app);
var router2 = require(path.join(routerPath, 'router2.js'))(express, app);
var indexRoute = require(path.join(routerPath, 'index.js'));
var freeDetailrouter = require(path.join(routerPath, 'freedetail.js'))(express, app);

app.use(router);
app.use(router2);
app.use(indexRoute);
app.use( require(path.join(routerPath, 'buy.js')) );
app.use(freeDetailrouter);
app.listen(PORT, function(){
  console.log('router Server listening at port %d', PORT);
});

    