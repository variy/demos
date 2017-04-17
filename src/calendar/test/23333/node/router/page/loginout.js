var isLogin = require('../../isLogin');//判断是否登录
/**
 * 路径说明：
 * 退出登录 /loginout
**/
module.exports = {
  get:function(req,res){
      res.clearCookie('user');
      req.session.flash = '退出登录成功';
      res.redirect(303,'/');
  }
};