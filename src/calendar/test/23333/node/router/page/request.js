var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信
/**
 * 路径说明
 * 好友请求列表 /request/
**/

module.exports = {
    get: function(req, res) {
        if (isLogin(req, res) === false) {
            req.session.flash = '请登录';
            res.redirect(303);
            return;
        }
        var User = isLogin(req, res);

        var postData = {
            mkey:User.mkey,
            mod:'ifriends',
            act:'sendreqlist',
            pn:1,
            ps:9999
        };
        api(postData).complete(function(data){
            var list = data.list;
            list.forEach(function(item){
                item["upicture"] = item["upicture"] || '/static/images/avatar.png';
                item["sex"] = parseInt(item["sex"]);
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

            });
            data.count = parseInt(data.count);
            res.render('request',{
                data:data
            });
        });




    }
};