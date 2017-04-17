var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信
/**
 * 路径说明
 * 搜索用户列表 /s/:key
 **/

module.exports = {
    get: function(req, res) {

        var me = this;
        if (isLogin(req, res) === false) {
            req.session.flash = '请登录';
            res.redirect(303, '/login');
            return;
        }

        var User = isLogin(req, res);

        var postData = {
            key:req.params.key,
            mkey:User.mkey,
            pn:1,
            ps:20,
            mod:'ifriends',
            act:'search'
        };

        api(postData).complete(function(data){
       //     console.log(data.list.length,data.more);
            var list = data.list;
            list.forEach(function(item){
                item["upicture"] = item["upicture"] || '/static/images/avatar.png';
                switch(item["sex"]){
                    case null:
                        item["sex"] = '';
                        break;
                    case 0:
                        item["sex"] = '男';
                        break;
                    case 1:
                        item["sex"] = '女';
                        break;
                }
                switch(item.relation){
                    case 0 :item.r_s = true;//自己
                        break;
                    case 1 : item.r_f = true;//好友
                        break;
                    case 2 : item.r_not_f = true;//非好友
                }
            });
            data.key = req.params.key;
            data.count = parseInt(data.count);
         //   console.log(data.count);
            res.render('search',{
                data:data,
                searchKey:data.key
            });
        });
    },
    post: function(req, res){
        if (isLogin(req, res) === false) {
            res.json({login:false});
            return;
        }

        var User = isLogin(req, res);

        var postData = {
            key:req.params.key,
            mkey:User.mkey,
            pn:req.body.pn === undefined?1:req.body.pn,
            ps:20,
            mod:'ifriends',
            act:'search'
        };


        api(postData).complete(function(data){
            var list = data.list;
            list.forEach(function(item){
                item["upicture"] = item["upicture"] || '/static/images/avatar.png';
                switch(item["sex"]){
                    case null:
                        item["sex"] = '';
                        break;
                    case 0:
                        item["sex"] = '男';
                        break;
                    case 1:
                        item["sex"] = '女';
                        break;
                }
                switch(item.relation){
                    case 0 :item.r_s = true;//自己
                        break;
                    case 1 : item.r_f = true;//好友
                        break;
                    case 2 : item.r_not_f = true;//非好友
                }

            });
            data.count = parseInt(data.count);


            data.noMore = !data.more;

            res.render('search_li',{
                data:data,
                searchKey:req.params.key,
                layout:null
            });
        });

    }
};