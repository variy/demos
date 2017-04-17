var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信

/**
 * 路径说明：
 * 好友相关请求 /ajax/friends
**/
module.exports = {
  post:function(req,res){
    var loginState = isLogin(req,res);
    if(!loginState){
        res.json({isLogin:false});
        return;
    }


    switch(req.body.act) {
        case 'search'://搜索
            var postData = {
                key: req.body.key,
                mkey: loginState.mkey,
                pn: 1,
                ps: 6,
                mod: 'ifriends',
                act: 'search'
            };
            api(postData).complete(function (data) {
                var list = data.list;
                list.forEach(function (item) {
                    item["upicture"] = item["upicture"] || '/static/images/avatar.png';
                    item["sex"] = item["sex"] === 0 ? "男" : "女";
                    switch (item.relation) {
                        case 0 :
                            item.r_s = true;//自己
                            break;
                        case 1 :
                            item.r_f = true;//好友
                            break;
                        case 2 :
                            item.r_not_f = true;//非好友
                    }
                });
                data.key = req.body.key;
                data.urlKey = encodeURIComponent(data.key);
                data.count = parseInt(data.count);
                res.render('ajax/friends_search', {
                    layout: null,
                    data: data
                });
                //    console.log(data);
            });
            break;
        case 'req'://请求加好友
            var postData = {
                tuid: req.body.tuid,
                mkey: loginState.mkey,
                mod: 'ifriends',
                act: 'req'
            };
            api(postData).complete(function (data) {
                res.json(data);
            });
            break;
        case 'reqlist'://好友请求列表
            var postData = {
                mkey: loginState.mkey,
                mod: 'ifriends',
                act: 'reqlist',
                pn: 1,
                ps: 5
            };

            api(postData).complete(function (data) {
                var ul = ['<ul class="dropdown-list s-request-list clearfix">'];
                data.list.forEach(function (item) {
                    var li = '\t<li class="clearfix s-request-item done" data-fuid="' + item.fuid + '">';
                    li += '<img src="' + (item.upicture || '/static/images/avatar.png') + '" class="fn-left" width="40" height="40">';
                    li += '<p class="ml55 f16">';
                    li += '<span class="color_red name">' + item.rname + '</span>';
                    item.sex = item.sex == null ? '' : item.sex;
                    item.sex = item.sex === 0 ? '男' : '女';
                    li += '<span class="ml30 sex">' + item.sex + '</span>';
                    li += '</p>';
                    li += '<p class="ml55 color_grey"></p>';
                    li += '<p class="request-btn-wrap">';
                    li += '<a class="conf-request-btn" href="javascript:">同意</a>';
                    li += '<a class="del-request-btn ml10" href="javascript:;">拒绝</a></p>';
                    li += '</li>';
                    ul.push(li);
                });
                if (data.list.length === 0) {
                    ul.push('<li class="clearfix s-request-item"><div class="no-result">当前没有新的好友请求</div></li>');
                }
                ul.push('</ul>');
                ul.push('<a class="check-more" href="/response/">查看全部</a>');
                res.send(ul.join('\n'));
            });
            break;
        case 'acc'://同意加好友
            var postData = {
                mkey: loginState.mkey,
                mod: 'ifriends',
                act: 'acc',
                fuid: req.body.fuid
            };
            api(postData).complete(function (data) {
                res.json(data);
            });
            break;
        case 'rej'://拒绝加好友
            var postData = {
                mkey: loginState.mkey,
                mod: 'ifriends',
                act: 'rej',
                fuid: req.body.fuid
            };
            api(postData).complete(function (data) {
                res.json(data);
            });
            break;
        case 'reqrev'://撤销好友请求
            var postData = {
                mkey: loginState.mkey,
                mod: 'ifriends',
                act: 'reqrev',
                tuid: req.body.tuid
            };
            api(postData).complete(function (data) {
                res.json(data);
            });
            break;
        case 'fridel'://删除好友关系
            var postData = {
                mkey:loginState.mkey,
                mod:'ifriends',
                act:'fridel',
                fuid:req.body.fuid
            };
            api(postData).complete(function(data){
                console.log(data);
                res.json(data);
            });
    }










  }
};