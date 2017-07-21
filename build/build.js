process.env.NODE_ENV = 'production';

require('shelljs/global')

var path = require('path')
var CONFIG = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')

var srcPath = CONFIG.srcPath;
var spinner = ora('building for production...');

spinner.start()
rm('-rf', CONFIG.destPath)
mkdir('-p', CONFIG.destPath)
cp('-R', path.join(srcPath, '/static/'), CONFIG.destPath);
cp('-R', path.join(srcPath, '/images/'), CONFIG.destPath);
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