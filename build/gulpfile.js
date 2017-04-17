var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-rimraf');
// var imagemin = require('gulp-imagemin');
var path = require('path');
var webpack = require('webpack');

var CONFIG = require('./config.js');
var srcPath = CONFIG.srcPath;
var destPath = CONFIG.destPath;

var imgSrcPath = path.join(srcPath, './images/**/*');
var imgDestPath = path.join(destPath, 'images');
var webpackConfig = require('./webpack.conf.js');

gulp.task('clean', function(){
    return gulp.src(destPath, {
        read: false
    }).pipe(clean({force: true}));
});

gulp.task('copyStatic', function(){
    return gulp.src(path.join(srcPath, './static/**/*'))
        .pipe(gulp.dest(path.join(destPath, 'static')));
});

gulp.task('images', function(){
    return gulp.src(imgSrcPath)
        // .pipe(imagemin({
        //     concurrent: 5
        // }))
        .pipe(gulp.dest(imgDestPath) );
}); 


var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build", function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback && callback();
    });
});

gulp.task('watch', function(){
    // gulp.watch(commonCssFile, ['cssCom']);
    // gulp.watch(imgSrcPath, ['image']);
    // gulp.watch('./public/common/images/**/*', ['comImage']);
    // gulp.watch('./public/'+ CONFIG.pj +'/**/*', ['build']);
});

gulp.task('default', ['clean'], function(){
    var tasks = ["copyStatic","images", "build"];
    // if( DEBUG ){
    //     tasks = tasks.concat(['watch']);
    // }
    gulp.start(tasks);
});
