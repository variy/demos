var http = require('http');
var querystring = require('querystring');
var config = require('./config.json');
var url = require('url');

module.exports = api;

/**调用方式
** post请求
     api({
        mod: 'idynamics',
        act: 'get',
        pn:0,
        ps:50
     }).complete(function(data,status){
        console.log(data);
     }).error(function(msg){
        console.log(msg);
     })
**
**/
function api(options){
    options = options || {};
    var postData = querystring.stringify(options);
    //解析请求地址
    var urls = url.parse(config.apiUrl);
    var o = {
        host: urls.hostname,
        port: urls.port,
        path: urls.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var callback = {
        complete:function(func){
            f_complete = func;
            return callback;
        },
        error:function(func){
            f_error = func;
            return callback;
        }
    };

    var f_complete,f_error;

    var req = http.request(o,function(res){
        res.setEncoding('utf8');
        var data = '';
        res.on('data',function(chunk){
            data += chunk;
        });
        res.on('end',function(){
            if(typeof f_complete === 'function'){
                try{
                    //尝试json服务器返回的数据
                    var param = JSON.parse(data);
                }catch(e){
                    //如果出错则传递字符串
                    var param = data;
                }finally{
                    //将json和状态码给complete
                    f_complete(param,res.statusCode);
                }
            }
        });
    });
    req.on('error',function(e){
        if(typeof f_error === 'function'){
            f_error(e.message);
        }
    });
    req.write(postData);
    req.end();
    return callback;
}