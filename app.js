var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');
var request = require('request');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
var app = express();

var CONFIG = require('./config.js');
var PORT = CONFIG.port;
var destPath = CONFIG.destPath;
var routerPath = CONFIG.routerPath;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

/*这种路径结构导致这种中间件无法*/
if( CONFIG.debug === '1'){

    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var configPath = path.join(__dirname, './webpack.conf.js')
    // console.log(configPath)

    var config = require(configPath);
    // console.log(configPath)

    var compiler = webpack(config);
    /*为什么这里的路径要配成 ./public 呢*/
    app.use(express.static(path.resolve(__dirname, CONFIG.srcPath)));
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        // hot: true,
        noInfo: false,
        inline: true,
        stats: {
            cached: false,
            colors: true
        }
    }));
    
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));

}else{
    // 调试生产地址，请求本地编译后的代码
    app.use(express.static( path.resolve(__dirname, CONFIG.destPath)));
}

/***** 路由处理 *****/
if( CONFIG.reqd === 'local'){
    // console.log('11111111111111111')
    // var routerPort = urlFn.parse(CONFIG.requestDomain).port;
    // require('./router-server')(routerPort);
}else if( CONFIG.reqd === 'PROD' ){
    // require('./router-server')(PORT);
    var router = require(path.join(routerPath, 'router.js'))(express, app);
    var router2 = require(path.join(routerPath, 'router2.js'))(express, app);
    var indexRoute = require(path.join(routerPath, 'index.js'));
    var freeDetailrouter = require(path.join(routerPath, 'freedetail.js'))(express, app);

    app.use(router);
    app.use(router2);
    app.use(indexRoute);
    app.use( require(path.join(routerPath, 'buy.js')) );
    app.use(freeDetailrouter);
}else{
    // node转发——for联调
    /******* 组合 *********/
    console.log('node转发****************'+  CONFIG.requestDomain);
    var proxyHostname = CONFIG.requestDomain;
    app.use('/ipsportfoliofront/zuhe', function(req, res){
        var url = proxyHostname + '/ipsportfoliofront/zuhe' + req.url;
        console.log('router >>>' + req.url);
        console.log('router >>>' + url);
        console.log('params >>>' + JSON.stringify(req.body));

        request.post(url, {json: req.body}).pipe(res);
    });


    app.use('/ipsportfoliofront/zuhedetail', function(req, res){
        var url = proxyHostname + '/ipsportfoliofront/zuhedetail' + req.url;
        console.log('router >>>' + req.url);
        console.log('router >>>' + url);
        console.log(typeof req.body)
        console.log('params >>>' + JSON.stringify(req.body));

        request.post(url, {json: req.body}).pipe(res);
    });

    app.use('/ipsportfoliofront/zuherelate', function(req, res){
        var url = proxyHostname + '/ipsportfoliofront/zuherelate' + req.url;
        console.log('router >>>' + req.url);
        console.log('router >>>' + url);
        console.log(typeof req.body)
        console.log('params >>>' + JSON.stringify(req.body));
        request.post(url, {json: req.body}).pipe(res);
    });
    /******* 组合 --end-- *********/
}
    
app.listen(PORT, function () {
  console.log('Server listening at port', PORT);
});

module.exports = app;

