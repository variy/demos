/*  
    @debug：是否是调试环境
    @pj项目名, frame
*/
var path = require('path');

var defaultOpts = {
    pj: 'manager'
};
console.log('>>> ' + process.argv)

var likelyPort = process.argv[2];
var port = Number(likelyPort) === Number(likelyPort) ? likelyPort : '8002';

var paramObj = {};
var argvs = process.argv.slice(2);

for(var i=0; i< argvs.length; i++){
    if(argvs[i].slice(0,2) !== '--')continue;
    var arr = argvs[i].slice(2).split('=');
    paramObj[arr[0]] = arr[1];
}

console.log('obj>>***>' + JSON.stringify(paramObj));
for(var attr in defaultOpts){
    if(!(attr in paramObj)){
        paramObj[attr] = defaultOpts[attr];
    }
}

module.exports = {
    debug: process.env.NODE_ENV === 'development',
    pj: paramObj.pj,
    port: port,
    rootPath:  path.join(__dirname, './src/'),
    commonPath: path.join(__dirname, './src/common'),
    srcPath:  path.join(__dirname, './src', paramObj.pj),
    destPath: path.join(__dirname, './dist/', paramObj.pj),
    routerPath: path.join(__dirname, './routes', paramObj.pj)
};