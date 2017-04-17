var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信

/**
 * 路径说明：
 * 头部个人信息 /ajax/loginstate
**/
module.exports = {
  post:function(req,res){
      var loginState = isLogin(req,res);
      if(!loginState){
          res.render('ajax/login_state',{layout:null,user:loginState});
          return;
      }

      api({//请求好友数
          mkey:loginState.mkey,
          mod:'ifriends',
          act:'reqcnt'
      }).complete(function(data){
          res.render('ajax/login_state',{layout:null,user:loginState,count:data.count});
      });
  }
};