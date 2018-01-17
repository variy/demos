var express = require('express');
var path = require('path');

var app = express();

var CONFIG = require('./config.js');
var PORT = CONFIG.port;
var destPath = CONFIG.destPath;

if( CONFIG.debug){
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpackConfig = require('./webpack.conf.js');

    var compiler = webpack(webpackConfig);
    app.use(express.static(path.resolve(__dirname, CONFIG.srcPath)));
    app.use('/common', express.static(path.resolve(__dirname, CONFIG.srcRootPath, 'common')));

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: false,
        inline: true,
        stats: {
            cached: false,
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    }));
    
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));

}else{
    // 调试生产地址，请求本地编译后的代码
    app.use(express.static( path.resolve(__dirname, CONFIG.destRootPath)));
}
    
app.listen(PORT, function () {
  console.log('Server listening at port', PORT);
});

module.exports = app;

