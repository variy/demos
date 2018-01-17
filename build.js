process.env.NODE_ENV = 'production';

var shell = require('shelljs');
var webpack = require('webpack')
var path = require('path')
var ora = require('ora')

var CONFIG = require('./config')
var webpackConfig = require('./webpack.conf.js')

var srcPath = CONFIG.srcPath;
var spinner = ora('building for production...');

spinner.start()
shell.rm('-rf', CONFIG.destPath)
shell.mkdir('-p', CONFIG.destPath)
shell.cp('-R', path.join(srcPath, '/static/'), CONFIG.destPath);
shell.cp('-R', path.join(srcPath, '/images/'), CONFIG.destPath);
var tamp1 = new Date().getTime();
webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')

    console.log('\n spend seconds ' + (new Date().getTime() - tamp1) / 1000 + 's');

})