var express = require('express');//express
var handlebars = require('express-handlebars');//模板引擎
var app = express();//express实例
var bodyParser = require('body-parser');//post中间件
var config = require('./node/config.json');//config配置

app.use('/static',express.static(__dirname+'/static'));//设置静态路径
app.use(require('cookie-parser')(config.cookieSecret));//让express支持cookie
app.use(require('cookie-session')({keys:[config.cookieSecret]}));//让express支持session
app.use(bodyParser.urlencoded({ extended: false }));//支持 application/x-www-form-urlencoded
app.use(bodyParser.json());//支持 application/json

app.engine('hbs',handlebars({
    extname:'.hbs',//设置模板引擎扩展名
    defaultLayout: 'main',//设置默认布局
    helpers:{//设置段落
        section:function(name,options){
            if(!this._sections){
                this._sections = {};
            }
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));

app.set('view engine','hbs');//设置模板引擎

app.use(function(req,res,next){//如果session有消息，用session传递到上下文，然后清除session
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

require('./node/router')(express,app);//路径控制


app.use(function(req, res) {//定制404
    res.type('text/plain').status(404).send('好像找不到这个页面');
});

app.use(function(err, req, res, next){//服务器错误
    console.error(err.stack);
    res.setHeader('Content-Type', 'text/plain');
    res.status(500).send('对不起，服务器出错啦！ o(>_<)o \n\n\n-----------------------------------\n'+err.stack);
});

app.listen(8888,function(){//启动服务
    var d = new Date(),
        t = function(n){return n<10? '0'+n.toString(): n.toString()};
    console.log('Start Bazi server on port 8888 at '+ d.getFullYear()+'.'+ t(d.getMonth())+'.'+ t(d.getDate())+' '+ t(d.getHours())+':'+ t(d.getMinutes())+':'+ t(d.getSeconds())+'.'+ d.getTime().toString().slice(-3));
});