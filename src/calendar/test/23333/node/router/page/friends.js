var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信
var lang = require('../../lang/zh_cn.js');//语言包
var _ = require('underscore');
/**
 * 路径说明：
 * 朋友 /friends
**/


/**
 * php act=
 * myfriactlist 最近活跃列表
 * myfribirlist 三天内生日列表
 * myfrilist  按成为好友时间降序排列，将最近添加的显示在最前
**/

function render(postData,callback){
    api(postData).complete(function(data){
        data.list.forEach(function(item,key){
            item['igender'] = parseInt(item['igender']);
            switch(item['igender']){
                case 0:
                    item['sex'] = '男';
                    break;
                case 1:
                    item['sex'] = '女';
                    break;
            }
            var tianGan = lang.tianGan;
            var diZhi = lang.diZhi;
            var siZhu = item['siZhu'].split(',');

            item['gz_year'] = tianGan[siZhu[0]]+diZhi[siZhu[1]];

            item['gz_month'] = tianGan[siZhu[2]]+diZhi[siZhu[3]];

            item['gz_day'] = tianGan[siZhu[4]]+diZhi[siZhu[5]];

            item['gz_hour'] = tianGan[siZhu[6]]+diZhi[siZhu[7]];


            item['upicture'] = item['upicture'] || '/static/images/avatar.png';
            item['mingju'] = lang.mingju.filter(function(arr){
                if(arr[0] === parseInt(item['mingju'])){
                    return true;
                }
            })[0][1];
        });
        callback && callback(data);
    });
}


module.exports = {
  get:function(req,res){
      var loginState = isLogin(req,res);

      if(loginState === false){
          req.session.flash = '请登录';
          res.redirect(303,'/login');
          return;
      }
      res.render('friends');


  },
  post:function(req,res){
      var loginState = isLogin(req,res);
      var postData = {
          mkey:loginState.mkey,
          mod:'ifriends',
          pn:req.body.pn === undefined?1:req.body.pn,
          ps:8,
          mj:req.body.mj
      };


      switch(req.body.type){
          case '即将生日':
              _.extend(postData,{act:'myfribirlist'});
              break;
          case '最近添加':
              _.extend(postData,{act:'myfrilist'});
              break;
          case '最新活跃':
              _.extend(postData,{act:'myfriactlist'});
              break;
      }

      render(postData,function(data){
              data.noMore = !data.more;
              res.render('partials/friends_li',{data:data,layout:null});
      });

  }
};