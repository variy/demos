var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信
var _ = require('underscore');

/**
 * 路径说明：
 * 弹窗登陆 /
**/
module.exports = {
  get:function(req,res){
       res.render('pop/login',{layout:'pop'});
	},
  post:function(req,res){
      var rt = {};
      switch(req.body.act){
          case 'login'://登录
              api({
                  mod:'iuaccount',
                  act:'login',
                  mobile: req.body.mobile,
                  pwd: req.body.pwd
              }).complete(function(data){
                 var json = {msg:data.msg};
                 if(data.msg === '成功'){
                     var user = {
                         mkey : data.mkey,
                         rname : data.aUinfo.rname,
                         upictrue:data.aUinfo.upicture
                     };
                     user = JSON.stringify(user);
                     res.cookie('user',user,{signed:true,maxAge:1000*60*60*24,httpOnly:true});//设置登录cookie
                 }
                 res.json(json);

              });
              break;
          case 'reg'://注册
              var regData = _.extend(req.body,{mod : 'iuaccount'});

              api(regData).complete(function(data){
                  res.json(data);
              });
              break;
          case 'sendSafetyCode'://发送验证码
              var sendData = _.extend(req.body,{mod:'iuaccount'});
              console.log(sendData);
              api(sendData).complete(function(data){
                  res.json(data);
              });
              break;
          case 'activation'://激活
              var acData = _.extend(req.body,{mod:'iuaccount'});
              api(acData).complete(function(data){
                  res.json(data);
              });
              break;
          case 'resetPwd'://重置密码
              var retData = _.extend(req.body,{mod:'iuaccount'});
              api(retData).complete(function(data){
                 res.json(data);
              });
      }
  }
};