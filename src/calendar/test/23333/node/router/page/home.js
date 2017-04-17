var isLogin = require('../../isLogin');//判断是否登录
/**
 * 路径说明：
 * 首页 /
**/
module.exports = {
  get:function(req,res){
      res.render('home');
  }
};