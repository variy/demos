var isLogin = require('../../isLogin');//判断是否登录
var url = require('url');
var api = require('../../api');//与php请求方法

/**
 * 路径说明
 * 登录 /login
**/
module.exports = {
  get:function(req,res){
      res.render('pop/login',{layout:'center'});
  },
  post:function(req,res){
      if(!req.body||!req.body.mobile || !req.body.pwd){
          req.session.flash = '输入错误！';
          res.redirect(303,'/login');
          return;
      }

      api({
          mod:'iuaccount',
          act:'login',
          mobile: req.body.mobile,
          pwd: req.body.pwd
      }).complete(function(data){
          if(data.msg !== '成功'){
              req.session.flash = data.msg;
              res.redirect(303)
          }else{
              req.session.flash = '登录成功！';
              var user = {
                  mkey : data.mkey,
                  rname : data.aUinfo.rname,
                  upictrue:data.aUinfo.upicture
              };
              user = JSON.stringify(user);
              res.cookie('user',user,{signed:true,maxAge:1000*60*24,httpOnly:true});//设置登录cookie
              var url = req.body.by || '/';
              res.redirect(303,url);
          }
      });
  }
};