/*
* 页面跳转处理
*/

(function (win, BAZI) {

    BAZI.Router = Backbone.Router.extend({

        routes: {
            //首页
            '': 'index',

            //登录
            'login': 'login',

            //记录页
            'recordList':function() {
                this.loginFirst(this.recordList);
            },


            //朋友页
            'friends': function() {
                this.loginFirst(this.friends);
            },

            //搜索结果
            'search': function() {
                this.loginFirst(this.search);
            },

            //个人中心
            'account': function() {
                this.loginFirst(this.account);
            },

            //个人中心-个人资料
            'accountPersonal': function() {
                this.loginFirst(this.accountPersonal);
            },

            //个人中心-隐私设置
            'accountPrivacy': function() {
                this.loginFirst(this.accountPrivacy);
            },

            //个人中心-头像设置
            'accountAvatar': function() {
                this.loginFirst(this.accountAvatar);
            },

            //好友请求
            'request':'FriendsRequest',

            //其他路径跳到首页
            '*s':'index'
        },


        initialize: function() {
            //头部
            new BAZI.Views.Header();
            $('#viewport').append($.tmpl(BAZI.tpls.tpls_content));

            new BAZI.Views.RighgtSideNav();
            new BAZI.Views.RighgtSideRecommend();

            $('#viewport').append($.tmpl(BAZI.tpls.tpls_footer));
            window.setInterval(this.getSysMessage, 100000);
            BAZI.userData = {};
        },

        //获取好友请求
        getSysMessage:function(){
            BAZI.Api.friend.reqcnt({mkey: BAZI.User.mkey},function(data){
                if(data.count>0){
                    $("#friends_request_btn").html("("+data.count+")");
                }
            });
        },

        //判断是否登录
        isLogin: function(){
            return !!BAZI.User.isLogin;
        },

        //页面载入判断登录
        loginFirst: function(loginSuccess){
            if( BAZI.User.isLogin ){
                loginSuccess && loginSuccess();
            }else{
                this.login('login', loginSuccess );
            }
        },

        //登录弹窗
        login: function(type, loginSuccess){
            if( BAZI.User.isLogin){
                return;
            }
            BAZI.views.Login = new BAZI.Views.UserView(type, loginSuccess);
        },

        //当前页面状态
        navCur:function(linkStr){
            $('.header .nav-wrap a:contains('+linkStr+')').parent().addClass('on').siblings().removeClass('on');
        },

        //个人中心当前页面状态
        accountnavCur:function(linkStr){
            $('.side-nav-account a:contains('+linkStr+')').parent().addClass('cur').siblings().removeClass('cur');
        },

        // 默认首页
        index: function(){
            BAZI.router.navigate('');

            BAZI.router.navCur('首页');

            BAZI.fromEvents = false;
            if('Index' in BAZI.views){
                BAZI.views.Index.$el.show().siblings().hide();
            }else{
                BAZI.views.Index = new BAZI.Views.Index();
            }

            if('UserBazi' in BAZI.views){
                BAZI.views.UserBazi.ac_show(0);
            }else{
                BAZI.views.UserBazi = new BAZI.Views.UserBazi({speed:0});
            }
        },

        record: function(data){
            if(!BAZI.User.isLogin){
                BAZI.router.index(true);
            }
            BAZI.views.Record = new BAZI.Views.Record(data);
        },
        FriendsRequest: function(data){
            this.navigate("request");
             if('FriendsRequest' in  BAZI.views){
                BAZI.views.FriendsRequest.$el.show().siblings().hide();
            }else{
               BAZI.views.FriendsRequest = new BAZI.Views.FriendsRequest();
            }
        },
        TopFriendRequest:function(data){
            this.navigate("toprequest");
            if("toprequest" in BAZI.views){
                 BAZI.views.toprequest.clear();
            }
            BAZI.views.toprequest = new BAZI.Views.TopFriendsRequest();
        },
        MyRequest: function(data){
            this.navigate("request");
            if("MyRequest" in BAZI.views){
                BAZI.views.MyRequest.$el.show().siblings().hide();
            }else{
                 BAZI.views.MyRequest = new BAZI.Views.MyRequest();
            }
        },
        recordList: function(data){

            BAZI.router.navCur('记录');

            if ('RecordList' in BAZI.views) {
                BAZI.views.RecordList.$el.show().siblings().hide();
            } else {
                BAZI.views.RecordList = new BAZI.Views.RecordListView(data);
            }
        },

        friends: function(data) {
            BAZI.router.navCur('朋友');
            if ("friends" in BAZI.views) {
                BAZI.views.friends.$el.show().siblings().hide();
            } else {
                BAZI.views.friends = new BAZI.Views.FriendsView(data);
            }
        },

        search: function(data){
            this.navigate("search");

            BAZI.views.search = new BAZI.Views.SearchView(data);
        },

        account: function(data) {
            if ("account" in BAZI.views) {
                BAZI.views.account.$el.show().siblings().hide();
            } else {
                BAZI.views.account = new BAZI.Views.accountView(data);
            }
        },

        accountPersonal: function(data) {
            BAZI.router.accountnavCur('基本资料');
            if ("accountPersonal" in BAZI.views) {
                BAZI.views.accountPersonal.$el.show().siblings().hide();
            } else {
                BAZI.views.accountPersonal = new BAZI.Views.accountPersonalView(data);
            }
        },

        accountPrivacy: function(data) {
            BAZI.router.accountnavCur('隐私设置');
            if ("accountPrivacy" in BAZI.views) {
                BAZI.views.accountPrivacy.$el.show().siblings().hide();
            } else {
                BAZI.views.accountPrivacy = new BAZI.Views.accountPrivacyView(data);
            }
        },

        accountAvatar: function(data) {
            BAZI.router.accountnavCur('头像设置');
            if ("accountAvatar" in BAZI.views) {
                BAZI.views.accountAvatar.$el.show().siblings().hide();
            } else {
                BAZI.views.accountAvatar = new BAZI.Views.accountAvatarView(data);
            }
        }
    });

})(window,BAZI);

