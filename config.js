/*  
    @debug：是否是调试环境，默认'0'非。  '1'是
    @pj项目名, frame
    @reqd 请求域名的地址，local FAT UAT PROD。非调试环境为空，即用相对地址。
*/
var path = require('path');
var requestDomainList = {
    // 本地
    'local': 'http://localhost:8007',
    // 后端个人
    'backend': 'http://10.243.246.95:8080',
    'FAT': 'http://stockfat.stg.pingan.com:30074',
    'UAT': 'https://stock.stg.pingan.com',
    'testPRD': 'https://stock.pingan.com',
    'PRD': ''
};
var defaultOpts = {
    debug: '1',
    pj: 'frame',
    reqd: 'local'
};
console.log('>>> ' + process.argv)

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
(paramObj.debug === '0') && (paramObj.reqd = 'PRD');

module.exports = {
    debug: paramObj.debug,
    pj: paramObj.pj,
    port: 8002,
    // reqd: paramObj.reqd,
    requestDomain: requestDomainList[paramObj.reqd],
    rootPath:  path.join(__dirname, './src/'),
    commonPath: path.join(__dirname, './src/common'),
    srcPath:  path.join(__dirname, './src', paramObj.pj),
    destPath: path.join(__dirname, './dist/', paramObj.pj),
    routerPath: path.join(__dirname, './routes', paramObj.pj)
};